"""Local Apache tests of shipped .htaccess; no public targets or load testing."""
import grp
import http.client
import os
from pathlib import Path
import pwd
import shutil
import socket
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
HTTPD = shutil.which('httpd') or '/usr/sbin/httpd'
MODULES = Path(os.environ.get('APACHE_MODULES', '/usr/libexec/apache2'))
assert Path(HTTPD).exists() and MODULES.is_dir(), 'Apache 2.4 and module directory required'

with tempfile.TemporaryDirectory(prefix='damvi-apache-test-') as directory:
    temp = Path(directory)
    public = temp / 'public'
    public.mkdir()
    shutil.copy(ROOT / 'public/.htaccess', public / '.htaccess')
    # Canary files should remain inaccessible even when accidentally deployed.
    for name in ['.env', '.git/config', 'backup.zip', 'dump.sql', 'index.html.bak', 'private/contact.php', 'tests/test.txt', 'seo/keys.csv', 'api/contact-lib.php', 'route-map.json', 'README.md']:
        file = public / name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text('CANARY_NOT_PUBLIC')
    (public / 'index.html').write_text('PUBLIC_OK')
    for name in ['llms.txt', 'llms-full.txt']:
        (public / name).write_text('DAMVI — цифровые решения', encoding='utf-8')
    (public / '404.html').write_text('NOT_FOUND')
    (public / '_pages/services').mkdir(parents=True)
    (public / '_pages/services/chatbots.html').write_text('CHATBOTS_OK')
    (public / 'assets').mkdir()
    (public / 'assets/test.css').write_text('body { color: black }')
    (public / '.well-known/acme-challenge').mkdir(parents=True)
    (public / '.well-known/acme-challenge/test').write_text('ACME_OK')
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    config = temp / 'httpd.conf'
    modules = ['mpm_event', 'unixd', 'authz_core', 'authz_host', 'headers', 'rewrite', 'dir', 'mime']
    # TraceEnable is server-only; Beget must confirm it, not .htaccess.
    lines = [f'ServerRoot "{temp}"', f'PidFile "{temp}/httpd.pid"', f'Listen 127.0.0.1:{port}', 'ServerName localhost', 'TraceEnable Off', f'ErrorLog "{temp}/error.log"', 'LogLevel warn']
    lines += [f'LoadModule {name}_module "{MODULES}/mod_{name}.so"' for name in modules]
    lines += [f'User {pwd.getpwuid(os.getuid()).pw_name}', f'Group {grp.getgrgid(os.getgid()).gr_name}', f'DocumentRoot "{public}"', 'TypesConfig /dev/null', 'AddType text/html .html', 'AddType text/css .css', f'<Directory "{public}">', 'AllowOverride All', 'Require all granted', '</Directory>']
    config.write_text('\n'.join(lines) + '\n')
    subprocess.run([HTTPD, '-t', '-f', str(config)], check=True, capture_output=True)
    process = subprocess.Popen([HTTPD, '-f', str(config), '-DFOREGROUND'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def get(path, method='GET', body=None):
        connection = http.client.HTTPConnection('127.0.0.1', port, timeout=5)
        try:
            connection.request(method, path, body=body)
            response = connection.getresponse()
            return response.status, dict(response.getheaders()), response.read().decode(errors='replace')
        finally:
            connection.close()

    try:
        for _ in range(100):
            if process.poll() is not None:
                raise AssertionError((temp / 'error.log').read_text())
            try:
                with socket.create_connection(('127.0.0.1', port), timeout=.1):
                    break
            except OSError:
                time.sleep(.03)
        status, headers, body = get('/')
        assert status == 200 and body == 'PUBLIC_OK', (status, body, (temp / 'error.log').read_text())
        assert 'script-src \'self\'' in headers['Content-Security-Policy']
        assert 'frame-ancestors \'self\'' in headers['Content-Security-Policy']
        assert headers['X-Content-Type-Options'] == 'nosniff'
        assert headers['X-Frame-Options'] == 'SAMEORIGIN'
        assert 'camera=()' in headers['Permissions-Policy']
        assert 'Strict-Transport-Security' not in headers, 'HSTS must not be advertised over HTTP'
        assert 'X-Robots-Tag' not in headers, 'AI file noindex leaked onto normal HTML'
        for path in ['/llms.txt', '/llms-full.txt']:
            status, file_headers, text = get(path)
            assert status == 200 and 'цифровые решения' in text
            assert file_headers.get('X-Robots-Tag') == 'noindex, follow'
            assert 'charset=utf-8' in file_headers['Content-Type'].lower()
        for path in ['/.env', '/%2eenv', '/.git/config', '/backup.zip', '/dump.sql', '/index.html.bak', '/private/contact.php', '/tests/test.txt', '/seo/keys.csv', '/api/contact-lib.php', '/route-map.json', '/README.md', '/_pages/services/chatbots.html']:
            status, _, body = get(path)
            assert status == 404 and 'CANARY_NOT_PUBLIC' not in body, (path, status, body)
        assert get('/.well-known/acme-challenge/test')[2] == 'ACME_OK'
        assert get('/services/chatbots')[2] == 'CHATBOTS_OK', 'Internal SEO rewrite broken'
        status, headers, _ = get('/services/chatbots/')
        assert status == 301 and headers['Location'].endswith('/services/chatbots'), 'Canonical trailing-slash redirect broken'
        assert get('/missing/')[0] == 404, 'Unknown paths must not turn into redirects or soft 404s'
        assert get('/assets/test.css')[0] == 200
        assert get('/missing')[0] == 404
        assert get('/', method='POST', body='test')[0] == 405
        assert get('/', method='TRACE')[0] == 405
        # No PHP requests here: this fixture deliberately has no PHP handler.
    finally:
        process.terminate()
        process.wait(timeout=5)

print('Apache security tests passed: headers, private/backup canaries, method restrictions, ACME and SEO rewrites.')
