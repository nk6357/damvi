"""Isolated PHP/MTA integration tests. Captures mail locally; sends no email."""
import concurrent.futures
import email.policy
from email.parser import BytesParser
import http.client
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
PHP = shutil.which('php')
assert PHP, 'PHP 8.2+ with mbstring is required'
PAYLOAD = dict(problem='Нужен сайт', contact='@test_user', phone='+7 (911) 123-45-67', consent=True, website='')


with tempfile.TemporaryDirectory(prefix='damvi-mail-test-') as directory:
    temp = Path(directory)
    public = temp / 'public_html'
    private = temp / 'private'
    private.mkdir(mode=0o700)
    (public / 'api').mkdir(parents=True)
    for name in ['contact.php', 'contact-lib.php']:
        shutil.copy(ROOT / 'public/api' / name, public / 'api' / name)
    config = private / 'contact.php'
    config.write_text("<?php return ['origins'=>['https://damvi.ru'], 'rate_secret'=>'" + 'x' * 64 + "'];")
    config.chmod(0o600)
    capture = temp / 'capture.php'
    capture.write_text("<?php file_put_contents(getenv('DAMVI_TEST_CAPTURE'), json_encode(['args'=>$argv,'message'=>stream_get_contents(STDIN)]).\"\\n\", FILE_APPEND|LOCK_EX); exit(is_file(getenv('DAMVI_TEST_FAIL'))?69:0);")
    messages_file = temp / 'messages.jsonl'
    failed = temp / 'fail'
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    env = {**os.environ, 'DAMVI_TEST_CAPTURE': str(messages_file), 'DAMVI_TEST_FAIL': str(failed)}
    process = subprocess.Popen([PHP, '-d', f'sendmail_path={PHP} {capture}', '-S', f'127.0.0.1:{port}', '-t', str(public)], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def request(data=PAYLOAD, method='POST', headers=None, raw=None):
        h = {'Origin': 'https://damvi.ru', 'Content-Type': 'application/json'}
        if headers:
            h.update(headers)
        body = json.dumps(data, ensure_ascii=False).encode() if raw is None else raw
        connection = http.client.HTTPConnection('127.0.0.1', port, timeout=5)
        try:
            connection.request(method, '/api/contact.php', body=body, headers=h)
            response = connection.getresponse()
            return response.status, dict(response.getheaders()), json.loads(response.read())
        finally:
            connection.close()

    def reset():
        (private / 'mail-rate.json').unlink(missing_ok=True)
        (private / 'request-rate.json').unlink(missing_ok=True)
        messages_file.unlink(missing_ok=True)

    def messages():
        return [json.loads(line) for line in messages_file.read_text().splitlines()] if messages_file.exists() else []

    try:
        for _ in range(100):
            if process.poll() is not None:
                raise AssertionError('PHP server exited')
            try:
                with socket.create_connection(('127.0.0.1', port), timeout=.1):
                    break
            except OSError:
                time.sleep(.03)
        else:
            raise AssertionError('PHP test server not ready')

        assert request(method='GET')[0] == 405
        assert request(headers={'Content-Type': 'text/plain'})[0] == 415
        assert request(headers={'Origin': 'https://damvi.ru.attacker.test'})[0] == 403
        assert request(headers={'Origin': ''})[0] == 403
        assert request(headers={'Sec-Fetch-Site': 'cross-site'})[0] == 403
        assert request(raw=b'{' )[0] == 400
        assert request(raw=b'[]')[0] == 400
        assert request(raw=b'x' * 20001)[0] == 413
        for changes in [
            {'problem': ' \u00a0\ufeff '}, {'problem': 'x' * 2501}, {'problem': {'nested': 'bad'}},
            {'problem': 'bad\x00text'}, {'contact': 'invalid'}, {'phone': '+7'},
            {'phone': '+1 (911) 123-45-67'}, {'consent': False}, {'consent': 'true'},
            {'website': 'spam'}, {'website': []}, {'website': None}, {'problem': None}, {'contact': 'x@example.test\r\nBcc: victim@example.test'},
            {'to': 'victim@example.test'},
        ]:
            assert request({**PAYLOAD, **changes})[0] == 422, changes
        assert not messages()
        assert not (private / 'mail-rate.json').exists(), 'Invalid input consumed delivery quota'
        reset()
        for _ in range(20):
            assert request({**PAYLOAD, 'problem': ''})[0] == 422
        assert request({**PAYLOAD, 'problem': ''})[0] == 429, 'Invalid-input flood was not limited'
        reset()

        # Two immediate valid requests; the next one must not reach the MTA.
        assert request()[0] == 200
        assert request({**PAYLOAD, 'contact': 'client@example.test'})[0] == 200
        status, headers, body = request()
        assert status == 429 and 590 <= int(headers['Retry-After']) <= 600
        assert body['retry_after'] > 0 and len(messages()) == 2
        assert request(headers={'X-Forwarded-For': '192.0.2.123'})[0] == 429

        reset()
        attack = '<script>alert(1)</script><img src="https://attacker.test/x">\r\nBcc: victim@example.test'
        assert request({**PAYLOAD, 'problem': attack})[0] == 200
        captured = messages()[0]
        mail = BytesParser(policy=email.policy.default).parsebytes(captured['message'].encode())
        assert str(mail['Subject']) == 'Заявка с сайта 🔥'
        assert mail['To'] == 'office@damvi.ru'
        assert str(mail['From']) == 'DAMVI <office@damvi.ru>'
        assert not mail['Bcc'] and not mail['Cc'] and not mail['Reply-To']
        assert captured['args'][1:] == ['-foffice@damvi.ru']
        assert mail.get_content_type() == 'multipart/alternative'
        plain = mail.get_body(preferencelist=('plain',)).get_content()
        html = mail.get_body(preferencelist=('html',)).get_content()
        assert '<strong>Заявка с сайта 🔥</strong>' in html
        assert 'href="tel:+79111234567"' in html
        assert '&lt;script&gt;' in html and '<script>' not in html and '<img ' not in html
        assert attack in plain and '+79111234567' in plain
        assert 'Куда вам ответить?' in html and '@test_user' in html

        reset()
        failed.touch()
        failure_response = request()
        assert failure_response[0] == 502, ('MTA failure must not show success', failure_response)
        failed.unlink()
        reset()
        config.rename(private / 'disabled.php')
        assert request()[0] == 503
        (private / 'disabled.php').rename(config)
        (private / 'mail-rate.json').write_text('corrupt')
        assert request()[0] == 503, 'Corrupt rate state must fail closed'
        assert not messages()
    finally:
        process.terminate()
        process.wait(timeout=5)

    # Deterministic clock: no ten-minute sleeps; second submission restarts cooldown.
    helper = ROOT / 'public/api/contact-lib.php'
    worker = "define('DAMVI_CONTACT_HANDLER',true);require $argv[1];echo \\Damvi\\Contact\\reserve($argv[2],str_repeat('x',64),$argv[3],(int)$argv[4]);"

    def reserve(path, ip, now):
        result = subprocess.run([PHP, '-r', worker, str(helper), str(path), ip, str(now)], capture_output=True, text=True, check=True)
        return int(result.stdout)

    state = temp / 'time.json'
    assert reserve(state, '192.0.2.1', 1000) == 0
    assert reserve(state, '192.0.2.1', 1100) == 0
    assert reserve(state, '192.0.2.1', 1100) == 600
    assert reserve(state, '192.0.2.1', 1699) == 1
    assert reserve(state, '192.0.2.1', 1700) == 0
    assert '192.0.2.1' not in state.read_text()
    assert state.stat().st_mode & 0o777 == 0o600
    parallel = temp / 'parallel.json'
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(lambda _: reserve(parallel, '192.0.2.2', 2000), range(12)))
    assert results.count(0) == 2 and results.count(600) == 10, results
    global_state = temp / 'global.json'
    for i in range(1, 21):
        assert reserve(global_state, f'192.0.2.{i}', 3000) == 0
    assert reserve(global_state, '192.0.2.21', 3000) == 60
    assert reserve(global_state, '192.0.2.21', 3059) == 1
    assert reserve(global_state, '192.0.2.21', 3060) == 0
    hourly = temp / 'hour.json'
    for i in range(100):
        assert reserve(hourly, f'198.51.100.{i + 1}', 5000 + (i // 20) * 61) == 0
    assert reserve(hourly, '203.0.113.1', 5400) == 3200

print('Contact tests passed: validation, origin, injection escaping, MIME/tel, two-request cooldown, concurrent limits, global cap and transport failure. No email sent.')
