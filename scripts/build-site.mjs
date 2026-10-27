import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const read = path => readFile(join(root, path), 'utf8');
const [html, css, js, logoDark, logoWhite, monogram, favicon, hosting] = await Promise.all([
  read('public/index.html'), read('public/styles.css'), read('public/app.js'),
  read('public/assets/damvi-logo-dark.svg'), read('public/assets/damvi-logo-white.svg'),
  read('public/assets/damvi-m-dot-icon.svg'), read('public/assets/damvi-m-dot-icon-square.svg'),
  read('.openai/hosting.json')
]);

const assets = {
  '/': { body: html, type: 'text/html; charset=utf-8' },
  '/index.html': { body: html, type: 'text/html; charset=utf-8' },
  '/styles.css': { body: css, type: 'text/css; charset=utf-8' },
  '/app.js': { body: js, type: 'text/javascript; charset=utf-8' },
  '/assets/damvi-logo-dark.svg': { body: logoDark, type: 'image/svg+xml' },
  '/assets/damvi-logo-white.svg': { body: logoWhite, type: 'image/svg+xml' },
  '/assets/damvi-m-dot-icon.svg': { body: monogram, type: 'image/svg+xml' },
  '/assets/damvi-m-dot-icon-square.svg': { body: favicon, type: 'image/svg+xml' }
};

const worker = `const ASSETS = ${JSON.stringify(assets)};
const isEmail = value => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/i.test(value);
const isTelegram = value => /^@[a-zA-Z0-9_]{5,32}$/.test(value) || /^https?:\\/\\/(?:t\\.me|telegram\\.me)\\/[a-zA-Z0-9_]{5,32}\\/?$/i.test(value);
const normalizePhone = value => { const digits = String(value || '').replace(/\\D/g, ''); if (digits.length < 10 || digits.length > 15) return null; if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) return '+7' + digits.slice(1); return '+' + digits; };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
async function contact(request, env) {
  let body; try { body = await request.json(); } catch { return json({ ok:false, message:'Не удалось прочитать данные формы.' }, 400); }
  const problem = String(body.problem || '').trim(); const contact = String(body.contact || '').trim(); const phone = normalizePhone(body.phone); const errors = {};
  if (problem.length < 50) errors.problem = 'Опишите задачу подробнее: минимум 50 символов.';
  if (!isEmail(contact) && !isTelegram(contact)) errors.contact = 'Укажите корректный email, @username или ссылку t.me.';
  if (!phone) errors.phone = 'Укажите корректный номер телефона.';
  if (Object.keys(errors).length) return json({ ok:false, errors }, 422);
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) return json({ ok:false, message:'Приём заявок ещё не настроен. Подключите почтовый транспорт в переменных окружения.' }, 503);
  const text = ['Новая заявка с сайта DAMVI', '', 'Проблема: ' + problem, 'Telegram / email: ' + contact, 'Телефон: ' + phone].join('\\n');
  const sent = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ Authorization:'Bearer ' + env.RESEND_API_KEY, 'content-type':'application/json' }, body:JSON.stringify({ from:env.CONTACT_FROM_EMAIL, to:[env.CONTACT_TO_EMAIL], subject:'Новая заявка DAMVI', text }) });
  if (!sent.ok) return json({ ok:false, message:'Не удалось отправить заявку. Попробуйте ещё раз позже.' }, 502);
  return json({ ok:true, message:'Заявка отправлена. Мы свяжемся с вами.' });
}
export default { async fetch(request, env) { const url = new URL(request.url); if (request.method === 'POST' && url.pathname === '/api/contact') return contact(request, env); if (request.method !== 'GET' && request.method !== 'HEAD') return json({ ok:false, message:'Method not allowed.' }, 405); const asset = ASSETS[url.pathname] || ASSETS['/']; return new Response(request.method === 'HEAD' ? null : asset.body, { headers:{ 'content-type':asset.type, 'cache-control':url.pathname.startsWith('/assets/') ? 'public, max-age=86400' : 'no-cache' } }); } };
`;

await rm(join(root, 'dist'), { recursive: true, force: true });
await mkdir(join(root, 'dist/server'), { recursive: true });
await mkdir(join(root, 'dist/.openai'), { recursive: true });
await writeFile(join(root, 'dist/server/index.js'), worker);
await writeFile(join(root, 'dist/.openai/hosting.json'), hosting);
console.log('Built DAMVI worker preview.');
