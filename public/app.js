import { otherServices } from './other-services.js';

const config = {
  contacts: { email: '', telegram: { label: '@nk6357', url: 'https://t.me/nk6357' }, phone: '' },
  services: [
    {
      slug: 'websites', name: 'Разработка сайтов', display: 'РАЗРАБОТКА САЙТОВ', price: 'от 15 000 ₽',
      title: 'Разработка сайтов для бизнеса под ключ',
      subtitle: 'Создаём аккуратные, быстрые и продающие сайты, которые выстраивают доверие к компании и превращают посетителей в заявки. Без шаблонных наценок и раздутых сроков.',
      facts: [['Стоимость', 'от 15 000 ₽'], ['Сроки', 'от 3 дней'], ['Гарантия', 'Договор, чеки и 30 дней бесплатной поддержки после сдачи']],
      sections: [
        { title: 'Какую проблему бизнеса решает сайт?', paragraphs: ['Отсутствие сайта, устаревший дизайн, отсутствие мобильной адаптации или неработающие формы оплаты и связи мешают бизнесу принимать заявки. Без трафика сайт сам по себе не приводит клиентов, но при запущенной рекламе некачественный ресурс просто сжигает бюджет.', 'Вы получаете рабочий инструмент, который корректно открывается на любом устройстве, сразу объясняет ценность предложения и доводит пользователя до покупки или обращения.'] },
        { title: 'Что входит в разработку сайта в DAMVI?', items: [
          ['Прототип и продающая структура', 'Проектируем логику страницы под вашу нишу, чтобы посетитель легко находил информацию и совершал целевое действие.'],
          ['Современный адаптивный дизайн', 'Обеспечиваем аккуратное отображение на компьютерах, планшетах и смартфонах.'],
          ['Интеграции и формы связи', 'Настраиваем мгновенную передачу заявок с сайта в Telegram, CRM или на электронную почту.']
        ] },
        { title: 'Почему выбирают DAMVI?', items: [
          ['Работаем на результат', 'Не делаем продукт ради галочки — решаем конкретную проблему бизнеса.'],
          ['Фиксируем стоимость', 'Цена согласовывается на старте и не вырастает в процессе без изменения задачи.'],
          ['Работаем прозрачно', 'Оформляем договор, чеки и закрывающие документы.']
        ] }
      ],
      cta: 'Рассчитать стоимость моего сайта'
    },
    {
      slug: 'chatbots', name: 'Разработка чат-ботов', display: 'РАЗРАБОТКА ЧАТ-БОТОВ', price: 'от 5 000 ₽',
      title: 'Разработка чат-ботов для бизнеса: Telegram, VK, MAX и сайты',
      subtitle: 'Перестаньте упускать обращения в нерабочие часы. Бот обработает входящий поток, проконсультирует и запишет клиента 24/7 на удобной платформе.',
      facts: [['Стоимость', 'от 5 000 ₽'], ['Сроки', 'от 2 дней'], ['Платформы', 'Telegram, VK, MAX и сайты']],
      sections: [
        { title: 'Зачем бизнесу чат-бот?', paragraphs: ['Если потенциальный покупатель пишет вечером и долго не получает ответа, вероятность сделки быстро падает. Чат-бот отвечает за секунды, выдаёт актуальный прайс, обрабатывает частые вопросы, фиксирует контакты, помогает записаться и принять оплату.'] },
        { title: 'Каких ботов мы создаём?', items: [
          ['Telegram-боты', 'От ботов-визиток и лидогенераторов до Mini Apps и магазинов внутри Telegram.'],
          ['Чат-боты ВКонтакте', 'Автоматизация сообщений в сообществах, прогрев аудитории и сбор базы подписчиков.'],
          ['Боты для MAX', 'Интеграция процессов бизнеса в корпоративную и клиентскую среду мессенджера.'],
          ['ИИ-чат-боты', 'Подключение нейросетей для консультаций на основе вашей базы знаний.']
        ] },
        { title: 'Как проходит работа?', items: [
          ['Анализ', 'Разбираем задачу и подбираем подходящую платформу.'],
          ['Сценарий', 'Прорабатываем диалог и техническую логику.'],
          ['Интеграция', 'Связываем бота с CRM или Telegram-чатом для уведомлений.'],
          ['Запуск', 'Тестируем сценарии и запускаем бота в работу.']
        ] }
      ],
      cta: 'Заказать разработку бота'
    },
    {
      slug: 'ai-automation', name: 'ИИ и автоматизация', display: 'ИИ И АВТОМАТИЗАЦИЯ', price: 'от 15 000 ₽',
      title: 'Внедрение ИИ и автоматизация бизнес-процессов',
      subtitle: 'Освободите себя и сотрудников от рутины. Внедряем нейросети и кастомные алгоритмы, которые экономят десятки часов рабочего времени.',
      facts: [['Стоимость', 'от 15 000 ₽'], ['Сроки', 'от 4 дней']],
      sections: [
        { title: 'Ручная работа съедает прибыль', paragraphs: ['Каждый день сотрудники тратят время на перенос данных в CRM, ручную отправку сообщений, обработку документов и составление типовых ответов. DAMVI переводит повторяющиеся задачи на автопилот.'] },
        { title: 'Что мы автоматизируем?', items: [
          ['Умные ИИ-ассистенты', 'Настраиваем нейросети на базе внутренних материалов для быстрых ответов клиентам и сотрудникам.'],
          ['Сквозной сбор данных', 'Связываем сайты, мессенджеры, таблицы и CRM в единую цепочку.'],
          ['Документы и заявки', 'Автоматизируем разбор входящих документов и обращений без постоянного участия человека.']
        ] }
      ],
      cta: 'Автоматизировать процессы'
    },
    {
      slug: 'geo', name: 'GEO-продвижение', display: 'GEO-ПРОДВИЖЕНИЕ', price: '10 000 ₽',
      title: 'GEO-продвижение: оптимизация под рекомендации ИИ',
      subtitle: 'Повышаем вероятность того, что нейросети порекомендуют именно ваш бизнес, когда потенциальные клиенты ищут решение своей задачи.',
      facts: [['Стоимость', '10 000 ₽'], ['Формат', 'фиксированная стоимость']],
      sections: [
        { title: 'Что такое GEO?', paragraphs: ['Всё больше людей не листают десятки сайтов, а задают прямой вопрос нейросетям: какую компанию выбрать или где найти подходящее решение. ИИ собирает данные из открытых источников и формирует несколько конкретных рекомендаций.', 'GEO — это комплекс мер, который помогает алгоритмам корректно понять ваш бизнес и включать его в релевантные ответы.'] },
        { title: 'Что входит в GEO-продвижение от DAMVI?', items: [
          ['Анализ присутствия', 'Проверяем, что нейросети уже знают о вашем бизнесе и нише.'],
          ['Оптимизация цифрового следа', 'Формируем экспертное окружение, упоминания и структурированные данные, которые учитывают нейросетевые модели.'],
          ['Адаптация сайта под ИИ', 'Создаём и корректируем смысловые блоки для восприятия алгоритмами Алиса AI, ChatGPT, Gemini и других систем.']
        ] },
        { title: 'Результат для бизнеса', paragraphs: ['Повышается вероятность появления компании в точечных рекомендациях нейросетей в тот момент, когда клиент уже ищет решение и готов к покупке.'] }
      ],
      cta: 'Попасть в рекомендации ИИ'
    },
    {
      slug: 'seo', name: 'Настройка базового SEO', display: 'НАСТРОЙКА БАЗОВОГО SEO', price: '5 000 ₽',
      title: 'Настройка базового SEO для сайтов',
      subtitle: 'Подготовим сайт к индексации и продвижению в Яндексе и Google. Создадим технический фундамент, чтобы поисковые системы правильно видели и ранжировали ваш бизнес.',
      facts: [['Стоимость', '5 000 ₽'], ['Формат', 'разовая настройка'], ['Сроки', 'от 2 дней']],
      sections: [
        { title: 'Какую задачу решает базовая SEO-настройка?', paragraphs: ['Даже красивый сайт не приносит результата, если поисковые роботы не могут правильно его проиндексировать, путают заголовки или не видят целевые страницы.', 'Базовое SEO закрывает ключевые технические требования поисковых систем на старте, чтобы сайт корректно отображался в выдаче и был готов принимать трафик.'] },
        { title: 'Что входит в настройку?', items: [
          ['Мета-теги', 'Составляем и прописываем Title, Description и H1–H3 под ключевые услуги и регион.'],
          ['Технические файлы', 'Настраиваем sitemap.xml и robots.txt для поисковых роботов.'],
          ['Панели вебмастеров', 'Подключаем Яндекс Вебмастер и Google Search Console, подтверждаем права и отправляем сайт на индексацию.'],
          ['Open Graph', 'Настраиваем красивые превью ссылок в Telegram, VK и других сервисах.']
        ] },
        { title: 'Результат', paragraphs: ['Сайт подготовлен к индексации, быстрее появляется в поисковой выдаче и не содержит критических технических ошибок, мешающих дальнейшему продвижению.'] }
      ],
      cta: 'Заказать базовое SEO за 5 000 ₽'
    },
    {
      slug: 'seo-blog', aliases: ['support'], name: 'SEO-блог', display: 'SEO-БЛОГ', price: '30 000 ₽ / мес.',
      title: 'Ведение и создание SEO-блога для бизнеса',
      subtitle: 'Запустим экспертный блог, который будет привлекать органический трафик из поисковых систем и нейросетей месяцами после публикации.',
      facts: [['Стоимость', '30 000 ₽ в месяц'], ['Формат', 'создание и регулярное ведение']],
      sections: [
        { title: 'Какую задачу решает SEO-блог?', paragraphs: ['Реклама работает, пока на балансе есть бюджет. После остановки кампаний поток клиентов быстро сокращается.', 'SEO-блог — долгосрочный актив. Экспертные статьи под реальные поисковые запросы постепенно выходят в выдачу, формируют доверие к бренду и приводят тёплую аудиторию.'] },
        { title: 'Что входит в создание и ведение SEO-блога?', items: [
          ['Семантическое ядро', 'Находим вопросы, которые потенциальные клиенты вводят в поиске, и отбираем перспективные темы.'],
          ['Структура статей', 'Проектируем полезные материалы с правильными H1–H3, подзаголовками и списками.'],
          ['Экспертная подача', 'Раскрываем сложные темы понятным языком, добавляем практику, кейсы и цифры без искусственного рерайтинга.'],
          ['Внутренняя оптимизация', 'Настраиваем Title, Description и перелинковку с коммерческими страницами.'],
          ['Публикация', 'Оформляем материалы на сайте, добавляем выводы и призывы к действию.']
        ] },
        { title: 'Результат', paragraphs: ['Сайт получает постоянный приток целевой органической аудитории, а потенциальные клиенты знакомятся с вашей экспертизой ещё до обращения.'] }
      ],
      cta: 'Обсудить запуск SEO-блога'
    }
  ],
  otherServices,
  projects: [
    {
      name: 'INSOL для разработчиков',
      type: 'Платформа верификации',
      description: 'Сайт сервиса INSOL AI Passport для верификации разработчиков и представления компетенций корпоративным клиентам.',
      url: 'https://insol-dvlp.ru'
    },
    {
      name: 'INSOL для заказчиков',
      type: 'Подбор AI-исполнителей',
      description: 'Сервис подбора проверенных AI-разработчиков и интеграторов по компетенциям, технологиям, отрасли, бюджету и надёжности.',
      url: 'https://insol-cst.ru'
    },
    {
      name: 'Кинкали',
      type: 'Сайт ресторана',
      description: 'Сайт ресторана грузинской кухни «Кинкали» в Перми.',
      url: 'https://kinkali.ru'
    }
  ]
};

const iconTelegram = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 3.3 2.8 10.6c-1.3.5-1.2 1.3-.2 1.6l4.8 1.5 1.9 5.9c.2.6.1.8.7.8.4 0 .6-.2.8-.4l2.3-2.2 4.8 3.6c.9.5 1.5.2 1.7-.8L22.8 5c.4-1.3-.5-1.9-1.3-1.7ZM8.3 13.4l10.8-6.8c.5-.3.9-.1.5.3l-8.7 7.9-.3 3.3-2.3-4.7Z"/></svg>';
const iconPhone = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 2.5 4.4 3.6c-.8.4-1.2 1.3-1 2.1C5 12.7 11.3 19 18.3 20.6c.8.2 1.7-.2 2.1-1l1.1-2.2c.3-.7.1-1.5-.6-1.9l-3.2-1.7c-.6-.3-1.4-.2-1.9.3l-1.2 1.2c-2.2-1.2-4-3-5.2-5.2l1.2-1.2c.5-.5.6-1.3.3-1.9L8.5 3.1a1.5 1.5 0 0 0-1.9-.6Z"/></svg>';
const arrow = '<span class="process-arrow" aria-hidden="true">↓</span>';
const escape = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

function siteNav() {
  return `<header class="site-nav" id="site-nav"><div class="site-nav-inner"><a class="nav-logo" href="/" aria-label="DAMVI — на главную"><img src="/assets/damvi-logo-white.svg" alt="DAMVI" /></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Открыть меню"><span></span><span></span><span></span></button><nav class="nav-links" id="nav-links" aria-label="Основное меню"><a href="/#approach">Подход</a><a href="/#services">Направления</a><a href="/projects">Наши работы</a><a class="nav-cta" href="/#discuss">Обсудить задачу</a></nav></div></header>`;
}

function footer() {
  const contacts = [
    config.contacts.email && `<a href="mailto:${escape(config.contacts.email)}">${escape(config.contacts.email)}</a>`,
    config.contacts.telegram && `<a href="${escape(config.contacts.telegram.url)}" target="_blank" rel="noreferrer">${escape(config.contacts.telegram.label)}</a>`,
    config.contacts.phone && `<a href="tel:${escape(config.contacts.phone.replace(/\s/g, ''))}">${escape(config.contacts.phone)}</a>`
  ].filter(Boolean).join('');
  return `<footer class="site-footer"><div class="footer-grid"><div class="footer-brand"><img src="/assets/damvi-logo-white.svg" alt="DAMVI" /><p>Агентство цифровых решений для бизнеса</p></div><nav aria-label="Услуги"><p class="footer-label">Направления</p>${config.services.map(s => `<a href="/services/${s.slug}">${escape(s.name)}</a>`).join('')}<a href="/services/other">Другие услуги</a></nav><nav aria-label="Разделы"><p class="footer-label">Разделы</p><a href="/projects">Наши работы</a><a href="/#discuss">Обсудить задачу</a><a href="/privacy">Политика конфиденциальности</a></nav>${contacts ? `<address>${contacts}</address>` : ''}</div><div class="footer-bottom">© ${new Date().getFullYear()} DAMVI</div></footer>`;
}

function form() {
  return `<form id="contact-form" class="contact-form" novalidate><div class="form-head"><p>Расскажите о задаче</p><span>Начнём с проблемы, а не с готового решения</span></div><label class="sr-only" for="problem">Опишите проблему</label><textarea id="problem" name="problem" aria-label="Опишите проблему" placeholder="Что сейчас не работает или мешает бизнесу зарабатывать?" required minlength="50"></textarea><p class="field-error" id="problem-error" aria-live="polite"></p><div class="contact-fields"><div class="underlined-field"><label class="sr-only" for="contact">Telegram или email</label>${iconTelegram}<input id="contact" name="contact" autocomplete="email" placeholder="Telegram или email" required /></div><div class="underlined-field"><label class="sr-only" for="phone">Номер телефона</label>${iconPhone}<input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Номер телефона" required /></div></div><div class="contact-errors" aria-live="polite"><p id="contact-error"></p><p id="phone-error"></p></div><button class="button button-red" type="submit"><span>Обсудить задачу</span><span aria-hidden="true">↗</span></button><p class="form-status" id="form-status" aria-live="polite"></p><p class="consent-note">Отправляя форму, вы соглашаетесь с <a href="/privacy">политикой конфиденциальности</a>.</p></form>`;
}

function servicesRows(list, variant = '') {
  return list.map(service => `<article class="service-row ${variant}"><h3>${escape(service.display)}</h3><p class="service-price">${service.price ? escape(service.price) : ''}</p><a class="button button-red" href="/services/${escape(service.slug)}">Подробнее</a></article>`).join('');
}

function renderServiceSection(section, index) {
  const paragraphs = (section.paragraphs || []).map(paragraph => `<p>${escape(paragraph)}</p>`).join('');
  const items = (section.items || []).length ? `<ol class="service-detail-list">${section.items.map(([title, text], itemIndex) => `<li><span>${String(index + 1).padStart(2, '0')}.${String(itemIndex + 1).padStart(2, '0')}</span><div><h4>${escape(title)}</h4><p>${escape(text)}</p></div></li>`).join('')}</ol>` : '';
  return `<article class="service-detail-section"><p class="service-detail-number">${String(index + 1).padStart(2, '0')}</p><div><h3>${escape(section.title)}</h3>${paragraphs}${items}</div></article>`;
}

function serviceDetails(service) {
  const entryPriceNote = service.price.startsWith('от ') ? '<p class="entry-price-note">Цена с пометкой «от» — это минимальный бюджет входа в разработку или продвижение. Точная стоимость зависит от объёма и сложности задачи и фиксируется до начала работ.</p>' : '';
  return `<section class="service-detail"><div class="service-detail-intro"><p class="section-label">Решение под задачу бизнеса</p><h2>${escape(service.title)}</h2><p class="service-summary">${escape(service.subtitle)}</p><dl class="service-facts">${service.facts.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>${entryPriceNote}</div><div class="service-detail-body">${service.sections.map(renderServiceSection).join('')}</div><div class="service-cta-panel"><div><p class="section-label">Обсудим вашу задачу</p><h3>${escape(service.cta)}</h3><p>Напишите в Telegram — ответим на вопросы и предложим следующий шаг.</p></div><a class="button button-red" href="${escape(config.contacts.telegram.url)}" target="_blank" rel="noreferrer">${escape(config.contacts.telegram.label)} <span aria-hidden="true">↗</span></a></div></section>`;
}

function home() {
  const first = config.services.slice(0, 3);
  const second = [...config.services.slice(3), { slug: 'other', display: 'ДРУГИЕ УСЛУГИ', price: '' }];
  return `<section class="hero section-split" id="discuss"><div class="hero-form"><div class="hero-copy"><p class="section-label">Есть задача?</p><h1><span class="accent">ОПИШИТЕ ПРОБЛЕМУ,</span><span>КОТОРАЯ МЕШАЕТ</span><span>ЗАРАБАТЫВАТЬ</span></h1><p class="hero-lead">Расскажите, где бизнес теряет время, заявки или деньги. Мы разберём задачу и предложим следующий шаг.</p></div>${form()}</div><div class="hero-brand"><div class="hero-brand-content"><p class="section-label">DAMVI / DIGITAL</p><div class="hero-brand-title">АГЕНТСТВО<br />ЦИФРОВЫХ<br />РЕШЕНИЙ<br />ДЛЯ БИЗНЕСА</div><p class="hero-brand-note">Разработка · автоматизация · продвижение · поддержка</p></div><img class="hero-monogram" src="/assets/damvi-avatar-solid-dark.svg" alt="" /><a class="hero-scroll" href="#approach">Как мы работаем <span aria-hidden="true">↓</span></a></div></section><section class="approach section-split" id="approach"><div class="approach-copy"><p class="section-label">Подход</p><h2><span>ПРОБЛЕМА ЕСТЬ —</span>РЕШЕНИЕ НАЙДЁМ</h2><p>Мы разбираемся, что именно мешает бизнесу зарабатывать, и создаём цифровые решения под конкретную задачу. Не делаем продукт ради галочки — помогаем бизнесу двигаться вперёд.</p></div><div class="process" aria-label="Процесс работы"><p class="process-label">От задачи к результату</p><ol><li>РАЗБИРАЕМСЯ</li>${arrow}<li>ПРОЕКТИРУЕМ</li>${arrow}<li>РЕАЛИЗУЕМ</li>${arrow}<li>ПОДДЕРЖИВАЕМ</li></ol></div></section><section class="services-section services-primary" id="services"><div class="section-heading"><div><p class="section-label">Что делаем</p><h2><span>ОСНОВНЫЕ</span>НАПРАВЛЕНИЯ</h2></div><div class="section-heading-copy"><p>Подбираем набор инструментов под задачу бизнеса — от разработки до продвижения и поддержки.</p><p>Цены с пометкой «от» — минимальная стоимость входа в разработку или продвижение.</p></div></div>${servicesRows(first)}</section><section class="services-section services-secondary">${servicesRows(second, 'compact')}</section><section class="works"><div><p class="section-label">Портфолио</p><h2>НАШИ РАБОТЫ</h2><p>Проекты и результаты будут собраны на отдельной странице.</p></div><a class="button button-red" href="/projects"><span>Посмотреть проекты</span><span aria-hidden="true">↗</span></a></section>${footer()}`;
}

function innerHeader(title, eyebrow = 'НАПРАВЛЕНИЕ') { return `<header class="inner-header"><p>${eyebrow}</p><h1>${escape(title)}</h1></header>`; }
function servicePage(slug) {
  if (slug === 'other') return otherPage();
  const service = [...config.services, ...config.otherServices].find(item => item.slug === slug || item.aliases?.includes(slug));
  if (!service) return notFound();
  return `${innerHeader(service.name)}${serviceDetails(service)}${footer()}`;
}
function otherPage() { return `${innerHeader('Другие направления')}<section class="services-section other-directions"><div class="section-heading"><div><p class="section-label">Дополнительные решения</p><h2><span>ДРУГИЕ</span>НАПРАВЛЕНИЯ</h2></div><div class="section-heading-copy"><p>Берёмся за задачи, которым нужен отдельный цифровой продукт, интеграция, аналитика, дизайн или контент.</p><p>Цена «от» — минимальная стоимость входа. Точный бюджет фиксируем после уточнения объёма и сложности.</p></div></div>${servicesRows(config.otherServices, 'compact')}</section>${footer()}`; }
function projectsPage() { return `${innerHeader('Наши работы', 'ПОРТФОЛИО')}<section class="projects-page"><div class="section-heading"><div><p class="section-label">Реализованные проекты</p><h2><span>НАШИ</span>РАБОТЫ</h2></div><div class="section-heading-copy"><p>Сайты и цифровые продукты, которые уже работают для бизнеса.</p></div></div><div class="projects-grid">${config.projects.map((project, index) => `<article class="project-card"><p class="project-index">${String(index + 1).padStart(2, '0')}</p><p class="project-type">${escape(project.type)}</p><h3>${escape(project.name)}</h3><p>${escape(project.description)}</p><a class="button button-red" href="${escape(project.url)}" target="_blank" rel="noreferrer">Открыть проект <span aria-hidden="true">↗</span></a></article>`).join('')}</div></section>${footer()}`; }
function privacyPage() { return `${innerHeader('Политика конфиденциальности', 'ДОКУМЕНТ')}<section class="content-placeholder"><p>Текст политики будет добавлен владельцем сайта.</p></section>${footer()}`; }
function notFound() { return `${innerHeader('Страница не найдена', '404')}<section class="empty-state"><a class="button button-red" href="/">На главную</a></section>${footer()}`; }

function render() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  let content = path === '/' ? home() : path === '/projects' ? projectsPage() : path === '/privacy' ? privacyPage() : path.startsWith('/services/') ? servicePage(path.split('/').pop()) : notFound();
  document.querySelector('#app').innerHTML = `${siteNav()}<main>${content}</main>`;
  setupNav();
  setupForm();
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }
}

function setupNav() {
  const nav = document.querySelector('#site-nav');
  const toggle = nav?.querySelector('.nav-toggle');
  if (!nav || !toggle) return;
  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const opening = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', opening);
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-open', opening);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.onkeydown = event => { if (event.key === 'Escape') close(); };
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
    const button = formEl.querySelector('button'); button.disabled = true; button.innerHTML = '<span>Отправляем…</span>';
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) { Object.entries(result.errors || {}).forEach(([key, message]) => { document.querySelector(`#${key}-error`).textContent = message; formEl.elements[key]?.setAttribute('aria-invalid', 'true'); }); throw new Error(result.message || 'Не удалось отправить заявку.'); }
      status.className = 'form-status is-success'; status.textContent = result.message; formEl.reset();
    } catch (error) { status.className = 'form-status is-error'; status.textContent = error.message; }
    finally { button.disabled = false; button.innerHTML = '<span>Обсудить задачу</span><span aria-hidden="true">↗</span>'; }
  });
}
document.addEventListener('click', event => { const link = event.target.closest('a[href^="/"]'); if (!link || event.metaKey || event.ctrlKey) return; event.preventDefault(); history.pushState({}, '', link.href); render(); if (!window.location.hash) window.scrollTo(0, 0); });
window.addEventListener('popstate', render);
render();
