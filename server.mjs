import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const publicDir = join(process.cwd(), 'public');
const mime = {
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.json': 'application/json; charset=utf-8'
};

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};

const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
const isTelegram = value => /^@[a-zA-Z0-9_]{5,32}$/.test(value) || /^https?:\/\/(?:t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}\/?$/i.test(value);
const normalizePhone = value => {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return null;
  if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) return `+7${digits.slice(1)}`;
  return `+${digits}`;
};

async function sendMail(payload) {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return { configured: false };
  }
  const text = [
    'Новая заявка с сайта DAMVI', '', `Проблема: ${payload.problem}`,
    `Telegram / email: ${payload.contact}`, `Телефон: ${payload.phone}`
  ].join('\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: CONTACT_FROM_EMAIL, to: [CONTACT_TO_EMAIL], subject: 'Новая заявка DAMVI', text })
  });
  if (!response.ok) throw new Error(`Mail transport returned ${response.status}`);
  return { configured: true };
}

async function handleContact(req, res) {
  let raw = '';
  for await (const part of req) {
    raw += part;
    if (raw.length > 100000) return json(res, 413, { ok: false, message: 'Слишком большой объём данных.' });
  }
  let body;
  try { body = JSON.parse(raw); } catch { return json(res, 400, { ok: false, message: 'Не удалось прочитать данные формы.' }); }
  const problem = String(body.problem || '').trim();
  const contact = String(body.contact || '').trim();
  const phone = normalizePhone(body.phone);
  const errors = {};
  if (problem.length < 50) errors.problem = 'Опишите задачу подробнее: минимум 50 символов.';
  if (!isEmail(contact) && !isTelegram(contact)) errors.contact = 'Укажите корректный email, @username или ссылку t.me.';
  if (!phone) errors.phone = 'Укажите корректный номер телефона.';
  if (Object.keys(errors).length) return json(res, 422, { ok: false, errors });
  try {
    const result = await sendMail({ problem, contact, phone });
    if (!result.configured) return json(res, 503, { ok: false, message: 'Приём заявок ещё не настроен. Подключите почтовый транспорт в переменных окружения.' });
    return json(res, 200, { ok: true, message: 'Заявка отправлена. Мы свяжемся с вами.' });
  } catch (error) {
    console.error('Email send failed:', error.message);
    return json(res, 502, { ok: false, message: 'Не удалось отправить заявку. Попробуйте ещё раз позже.' });
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  if (req.method === 'POST' && url.pathname === '/api/contact') return handleContact(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { ok: false, message: 'Method not allowed.' });
  const requestPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const candidate = normalize(join(publicDir, requestPath));
  const isLocal = candidate.startsWith(publicDir);
  if (isLocal && existsSync(candidate)) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) {
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
}).listen(port, () => console.log(`DAMVI available at http://localhost:${port}`));
