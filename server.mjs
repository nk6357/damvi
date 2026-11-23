import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const publicDir = join(process.cwd(), 'public');
const publicReal = await realpath(publicDir);
const policy = readFileSync(join(publicDir, '.htaccess'), 'utf8').match(/^Header always set Content-Security-Policy "([^"]+)"$/m)?.[1];
if (!policy) throw new Error('Missing security policy');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};

createServer(async (req, res) => {
  res.setHeader('Content-Security-Policy', policy);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  let url, pathname;
  try {
    url = new URL(req.url || '/', 'http://localhost');
    pathname = decodeURIComponent(url.pathname);
    if (/[\x00-\x1f\x7f\\]/.test(pathname)) throw new Error('Invalid path');
  } catch { return json(res, 400, { ok: false }); }
  if (/(^|\/)\.(?!well-known(?:\/|$))|^\/(?:private|legal-drafts|seo|scripts|tests|node_modules|vendor)(?:\/|$)|\.(?:bak|old|orig|save|swp|tmp|sql|sqlite3?|db|log|ini|env|ya?ml|zip|tar|gz|7z|rar)(?:$|\/)/i.test(pathname)
      || /^\/(?:package(?:-lock)?\.json|composer\.(?:json|lock)|(?:contact|telegram)\.example\.php|README\.md|BEGET\.md|(?:FORM-SECURITY|SITE-SECURITY|DDOS-BEGET)\.txt|route-map\.json)$/i.test(pathname)
      || /\.php(?:\/|$)/i.test(pathname) && pathname !== '/api/contact.php') return json(res, 404, { ok: false });
  if (url.pathname === '/api/contact' || url.pathname === '/api/contact.php') {
    if (req.method === 'POST') return json(res, 503, { ok: false, message: 'Для отправки формы используйте PHP-сервер Beget. Напишите на office@damvi.ru.' });
    return json(res, 405, { ok: false, message: 'Метод не поддерживается.' });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { ok: false, message: 'Method not allowed.' });
  const requestPath = pathname === '/' ? '/index.html' : pathname;
  const candidate = normalize(join(publicDir, requestPath));
  const isLocal = candidate.startsWith(publicDir + '/');
  if (isLocal && existsSync(candidate)) {
    try {
      const info = await stat(candidate);
      const actual = await realpath(candidate);
      if (info.isFile() && actual.startsWith(publicReal + '/') && mime[extname(candidate)]) {
        res.writeHead(200, { 'Content-Type': mime[extname(candidate)] || 'application/octet-stream' });
        if (req.method === 'HEAD') return res.end();
        return createReadStream(candidate).pipe(res);
      }
    } catch { /* serve app shell */ }
  }
  const index = join(publicDir, 'index.html');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
  if (req.method === 'HEAD') return res.end();
  createReadStream(index).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`DAMVI available at http://localhost:${port}`));
