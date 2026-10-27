const config = {
  contacts: { email: '', telegram: '', phone: '' },
  services: [
    { slug: 'websites', name: 'Разработка сайтов', display: 'РАЗРАБОТКА САЙТОВ', price: 'от [цена] ₽' },
    { slug: 'chatbots', name: 'Разработка чат-ботов', display: 'РАЗРАБОТКА ЧАТ-БОТОВ', price: 'от [цена] ₽' },
    { slug: 'ai-automation', name: 'ИИ и автоматизация', display: 'ИИ И АВТОМАТИЗАЦИЯ', price: 'от [цена] ₽' },
    { slug: 'geo', name: 'GEO-продвижение', display: 'GEO-ПРОДВИЖЕНИЕ', price: 'от [цена] ₽' },
    { slug: 'seo', name: 'SEO-продвижение', display: 'SEO-ПРОДВИЖЕНИЕ', price: 'от [цена] ₽' },
    { slug: 'support', name: 'Техническая поддержка', display: 'ТЕХПОДДЕРЖКА', price: 'от [цена] ₽' }
  ],
  otherServices: ['Веб-приложения и онлайн-сервисы', 'MVP и прототипы', 'Мобильные приложения', 'Программы для компьютеров', 'Telegram и VK Mini Apps', 'Разработка собственных CRM', 'Интеграции', 'Парсеры и работа с данными', 'Веб-аналитика', 'Оптимизация конверсии', 'Веб-дизайн', 'Инфографика и карточки товаров', 'Видеомонтаж', 'ИИ-видео'],
  projects: []
};

const iconTelegram = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 3.3 2.8 10.6c-1.3.5-1.2 1.3-.2 1.6l4.8 1.5 1.9 5.9c.2.6.1.8.7.8.4 0 .6-.2.8-.4l2.3-2.2 4.8 3.6c.9.5 1.5.2 1.7-.8L22.8 5c.4-1.3-.5-1.9-1.3-1.7ZM8.3 13.4l10.8-6.8c.5-.3.9-.1.5.3l-8.7 7.9-.3 3.3-2.3-4.7Z"/></svg>';
const iconPhone = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 2.5 4.4 3.6c-.8.4-1.2 1.3-1 2.1C5 12.7 11.3 19 18.3 20.6c.8.2 1.7-.2 2.1-1l1.1-2.2c.3-.7.1-1.5-.6-1.9l-3.2-1.7c-.6-.3-1.4-.2-1.9.3l-1.2 1.2c-2.2-1.2-4-3-5.2-5.2l1.2-1.2c.5-.5.6-1.3.3-1.9L8.5 3.1a1.5 1.5 0 0 0-1.9-.6Z"/></svg>';
const arrow = '<span class="process-arrow" aria-hidden="true">↓</span>';
const escape = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

function footer() {
  const contacts = [
    config.contacts.email && `<a href="mailto:${escape(config.contacts.email)}">${escape(config.contacts.email)}</a>`,
    config.contacts.telegram && `<a href="${escape(config.contacts.telegram)}" rel="noreferrer">${escape(config.contacts.telegram)}</a>`,
    config.contacts.phone && `<a href="tel:${escape(config.contacts.phone.replace(/\s/g, ''))}">${escape(config.contacts.phone)}</a>`
  ].filter(Boolean).join('');
  return `<footer class="site-footer"><div class="footer-grid"><div class="footer-brand"><img src="/assets/damvi-logo-white.svg" alt="DAMVI" /><p>Агентство цифровых решений для бизнеса</p></div><nav aria-label="Услуги"><p class="footer-label">Направления</p>${config.services.map(s => `<a href="/services/${s.slug}">${escape(s.name)}</a>`).join('')}<a href="/services/other">Другие услуги</a></nav><nav aria-label="Разделы"><p class="footer-label">Разделы</p><a href="/projects">Наши работы</a><a href="/#discuss">Обсудить задачу</a><a href="/privacy">Политика конфиденциальности</a></nav>${contacts ? `<address>${contacts}</address>` : ''}</div><div class="footer-bottom">© ${new Date().getFullYear()} DAMVI</div></footer>`;
}

function form() {
  return `<form id="contact-form" class="contact-form" novalidate><label class="sr-only" for="problem">Опишите проблему</label><textarea id="problem" name="problem" aria-label="Опишите проблему" required minlength="50"></textarea><p class="field-error" id="problem-error" aria-live="polite"></p><div class="contact-fields"><div class="underlined-field"><label class="sr-only" for="contact">Telegram или email</label>${iconTelegram}<input id="contact" name="contact" autocomplete="email" placeholder="Telegram или email" required /></div><div class="underlined-field"><label class="sr-only" for="phone">Номер телефона</label>${iconPhone}<input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Номер телефона" required /></div></div><div class="contact-errors" aria-live="polite"><p id="contact-error"></p><p id="phone-error"></p></div><button class="button button-red" type="submit">Обсудить задачу</button><p class="form-status" id="form-status" aria-live="polite"></p><p class="consent-note">Отправляя форму, вы соглашаетесь с <a href="/privacy">политикой конфиденциальности</a>.</p></form>`;
}

function servicesRows(list, variant = '') {
  return list.map(service => `<article class="service-row ${variant}"><h3>${escape(service.display)}</h3><p class="service-price">${service.price ? escape(service.price) : ''}</p><a class="button button-red" href="/services/${escape(service.slug)}">Подробнее</a></article>`).join('');
}

function home() {
  const first = config.services.slice(0, 3);
  const second = [...config.services.slice(3), { slug: 'other', display: 'ДРУГИЕ УСЛУГИ', price: '' }];
  return `<section class="hero section-split" id="discuss"><div class="hero-form"><img class="hero-logo" src="/assets/damvi-logo-dark.svg" alt="DAMVI" /><h1><span>ОПИШИТЕ ПРОБЛЕМУ,</span>КОТОРАЯ МЕШАЕТ<br />ЗАРАБАТЫВАТЬ</h1>${form()}</div><div class="hero-brand"><div class="hero-brand-title">АГЕНТСТВО<br />ЦИФРОВЫХ<br />РЕШЕНИЙ<br />ДЛЯ БИЗНЕСА</div><img class="hero-monogram" src="/assets/damvi-avatar-solid-dark.svg" alt="" /></div></section><section class="approach section-split"><div class="approach-copy"><h2><span>ПРОБЛЕМА ЕСТЬ —</span>РЕШЕНИЕ НАЙДЁМ</h2><p>Мы разбираемся, что именно мешает бизнесу зарабатывать, и создаём цифровые решения под конкретную задачу. Не делаем продукт ради галочки — помогаем бизнесу двигаться вперёд.</p></div><div class="process" aria-label="Процесс работы"><ol><li>РАЗБИРАЕМСЯ</li>${arrow}<li>ПРОЕКТИРУЕМ</li>${arrow}<li>РЕАЛИЗУЕМ</li>${arrow}<li>ПОДДЕРЖИВАЕМ</li></ol></div></section><section class="services-section services-primary"><h2><span>ОСНОВНЫЕ</span>НАПРАВЛЕНИЯ</h2>${servicesRows(first)}</section><section class="services-section services-secondary">${servicesRows(second, 'compact')}</section><section class="works"><h2>НАШИ РАБОТЫ</h2><a class="button button-red" href="/projects">Посмотреть проекты</a></section>${footer()}`;
}

function innerHeader(title, eyebrow = 'НАПРАВЛЕНИЕ') { return `<header class="inner-header"><a class="inner-logo" href="/" aria-label="На главную"><img src="/assets/damvi-logo-dark.svg" alt="DAMVI" /></a><p>${eyebrow}</p><h1>${escape(title)}</h1></header>`; }
function servicePage(slug) {
  if (slug === 'other') return otherPage();
  const service = config.services.find(item => item.slug === slug);
  if (!service) return notFound();
  return `${innerHeader(service.name)}<section class="content-placeholder"><p>Здесь появится описание направления, когда вы подготовите контент.</p><a class="button button-red" href="/#discuss">Обсудить задачу</a></section>${footer()}`;
}
function otherPage() { return `${innerHeader('Другие услуги')}<section class="other-services"><p>Дополнительные направления — для задач, которые не укладываются в основные категории.</p><ul>${config.otherServices.map(item => `<li>${escape(item)}<span>Место для будущего описания</span></li>`).join('')}</ul><a class="button button-red" href="/#discuss">Обсудить задачу</a></section>${footer()}`; }
function projectsPage() { return `${innerHeader('Наши работы', 'ПОРТФОЛИО')}<section class="empty-state"><p>Проекты появятся здесь после публикации.</p><a class="button button-red" href="/#discuss">Обсудить задачу</a></section>${footer()}`; }
function privacyPage() { return `${innerHeader('Политика конфиденциальности', 'ДОКУМЕНТ')}<section class="content-placeholder"><p>Текст политики будет добавлен владельцем сайта.</p></section>${footer()}`; }
function notFound() { return `${innerHeader('Страница не найдена', '404')}<section class="empty-state"><a class="button button-red" href="/">На главную</a></section>${footer()}`; }

function render() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  let content = path === '/' ? home() : path === '/projects' ? projectsPage() : path === '/privacy' ? privacyPage() : path.startsWith('/services/') ? servicePage(path.split('/').pop()) : notFound();
  document.querySelector('#app').innerHTML = content;
  setupForm();
}

function validateClient(data) {
  const errors = {};
  if (data.problem.trim().length < 50) errors.problem = 'Опишите задачу подробнее: минимум 50 символов.';
  if (!(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(data.contact) || /^@[a-zA-Z0-9_]{5,32}$/.test(data.contact) || /^https?:\/\/(?:t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}\/?$/i.test(data.contact))) errors.contact = 'Укажите корректный email, @username или ссылку t.me.';
  const digits = data.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) errors.phone = 'Укажите корректный номер телефона.';
  return errors;
}
function setupForm() {
  const formEl = document.querySelector('#contact-form');
  if (!formEl) return;
  const phone = formEl.elements.phone;
  phone.addEventListener('input', () => { const raw = phone.value.replace(/\D/g, '').slice(0, 11); if (raw.length <= 1) phone.value = raw; else if (raw.length <= 4) phone.value = `+${raw[0] === '8' ? '7' : raw[0]} (${raw.slice(1)}`; else if (raw.length <= 7) phone.value = `+${raw[0] === '8' ? '7' : raw[0]} (${raw.slice(1, 4)}) ${raw.slice(4)}`; else phone.value = `+${raw[0] === '8' ? '7' : raw[0]} (${raw.slice(1, 4)}) ${raw.slice(4, 7)}-${raw.slice(7, 9)}${raw.length > 9 ? `-${raw.slice(9, 11)}` : ''}`; });
  formEl.addEventListener('submit', async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(formEl));
    const errors = validateClient(data);
    ['problem', 'contact', 'phone'].forEach(key => { document.querySelector(`#${key}-error`).textContent = errors[key] || ''; formEl.elements[key].setAttribute('aria-invalid', String(Boolean(errors[key]))); });
    const status = document.querySelector('#form-status');
    status.textContent = '';
    if (Object.keys(errors).length) return;
    const button = formEl.querySelector('button'); button.disabled = true; button.textContent = 'Отправляем…';
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) { Object.entries(result.errors || {}).forEach(([key, message]) => { document.querySelector(`#${key}-error`).textContent = message; formEl.elements[key]?.setAttribute('aria-invalid', 'true'); }); throw new Error(result.message || 'Не удалось отправить заявку.'); }
      status.className = 'form-status is-success'; status.textContent = result.message; formEl.reset();
    } catch (error) { status.className = 'form-status is-error'; status.textContent = error.message; }
    finally { button.disabled = false; button.textContent = 'Обсудить задачу'; }
  });
}
document.addEventListener('click', event => { const link = event.target.closest('a[href^="/"]'); if (!link || event.metaKey || event.ctrlKey) return; event.preventDefault(); history.pushState({}, '', link.href); render(); window.scrollTo(0, 0); });
window.addEventListener('popstate', render);
render();
