import { getPageSeo, applyPageSeo } from './seo.js';
import { relatedServiceSlugs, serviceSearchLabels, getServiceFaq } from './service-search-content.js';
import { agencyProfile, homeFaq, goalContent } from './search-content.js';

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
        { title: 'Что входит в разработку сайта в Damvi?', items: [
          ['Прототип и продающая структура', 'Проектируем логику страницы под вашу нишу, чтобы посетитель легко находил информацию и совершал целевое действие.'],
          ['Современный адаптивный дизайн', 'Обеспечиваем аккуратное отображение на компьютерах, планшетах и смартфонах.'],
          ['Интеграции и формы связи', 'Настраиваем мгновенную передачу заявок с сайта в Telegram, CRM или на электронную почту.']
        ] },
        { title: 'Почему выбирают Damvi?', items: [
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
        { title: 'Ручная работа съедает прибыль', paragraphs: ['Каждый день сотрудники тратят время на перенос данных в CRM, ручную отправку сообщений, обработку документов и составление типовых ответов. Damvi переводит повторяющиеся задачи на автопилот.'] },
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
        { title: 'Что входит в GEO-продвижение от Damvi?', items: [
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
  otherServices: null,
  projects: [
    {
      slug: 'insol',
      name: 'Сайт для B2B-компании Insol',
      type: 'Сайт платформы',
      description: 'Сайт платформы оценки и подбора проверенных AI-разработчиков/интеграторов для бизнеса.',
      url: 'https://insol-dvlp.ru'
    },
    {
      slug: 'kinkali',
      name: 'Кинкали',
      type: 'Сайт ресторана',
      description: 'Сайт ресторана грузинской кухни «Кинкали» в Перми.',
      url: 'https://kinkali.ru'
    }
  ]
};

const arrow = '<span class="process-arrow" aria-hidden="true">↓</span>';
const escape = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const brandText = value => escape(value).replaceAll('Damvi', '<span class="brand-name">Damvi</span>');

const pages = document.querySelector('meta[name="damvi-pages-base"]');
const basePath = pages?.content || '';
const withBasePath = html => basePath ? html.replace(/(\b(?:href|src)=")\/(?!\/)/g, '$1' + basePath + '/') : html;

function siteNav() {
  return `<header class="site-nav" id="site-nav"><div class="site-nav-inner"><a class="nav-logo" href="/" aria-label="Damvi — на главную"><img src="/assets/damvi-logo-white.svg" width="4096" height="1365" alt="Damvi" /></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Открыть меню"><span></span><span></span><span></span></button><nav class="nav-links" id="nav-links" aria-label="Основное меню"><a href="/">Главная</a><a href="/#services">Наши услуги</a><a href="/projects">Наши работы</a><a class="nav-cta button-shine" href="/#contact-form">Обсудить задачу</a></nav></div></header>`;
}

function footer() {
  const contacts = [
    config.contacts.email && `<a href="mailto:${escape(config.contacts.email)}">${escape(config.contacts.email)}</a>`,
    config.contacts.telegram && `<a href="${escape(config.contacts.telegram.url)}" target="_blank" rel="noreferrer">Telegram</a>`,
    config.contacts.phone && `<a href="tel:${escape(config.contacts.phone.replace(/\s/g, ''))}">${escape(config.contacts.phone)}</a>`
  ].filter(Boolean).join('');
  return `<footer class="site-footer"><div class="footer-grid"><div class="footer-brand"><img loading="lazy" src="/assets/damvi-logo-white.svg" width="4096" height="1365" alt="Damvi" /><p>Агентство цифровых решений для бизнеса</p></div><div class="footer-contact">${contacts ? `<address id="contacts"><p class="footer-label">Контакты</p>${contacts}</address>` : ''}<nav class="footer-legal" aria-label="Правовые документы"><a href="/privacy">Политика обработки данных</a><a href="/consent">Согласие на обработку данных</a><a href="/legal">Информация об исполнителе</a></nav></div></div><div class="footer-bottom">© ${new Date().getFullYear()} Damvi</div></footer>`;
}

function form() {
  return `<form id="contact-form" class="contact-form" novalidate>
    <div class="form-field">
      <label for="problem">Опишите, что мешает бизнесу зарабатывать</label>
      <textarea id="problem" name="problem" placeholder="Например, заявки с сайта теряются, а менеджеры вручную переносят их в CRM" aria-describedby="problem-error" required></textarea>
      <p class="field-error" id="problem-error" aria-live="polite"></p>
    </div>
    <div class="form-field">
      <label for="contact">Куда вам ответить?</label>
      <input id="contact" name="contact" autocapitalize="none" spellcheck="false" placeholder="@username или email" aria-describedby="contact-error" required />
      <p class="field-error" id="contact-error" aria-live="polite"></p>
    </div>
    <div class="form-field">
      <label for="phone">Номер для связи</label>
      <input id="phone" name="phone" type="tel" autocomplete="tel" value="+7" aria-describedby="phone-error" required />
      <p class="field-error" id="phone-error" aria-live="polite"></p>
    </div>
    <div class="form-consent">
      <label class="consent-checkbox" for="consent"><input id="consent" name="consent" type="checkbox" aria-describedby="consent-error" required /><span>Я согласен на <a href="/consent" target="_blank" rel="noopener">обработку персональных данных</a></span></label>
      <p class="field-error" id="consent-error" aria-live="polite"></p>
    </div>
    <button class="button button-red button-shine" type="submit" disabled><span class="form-submit-label">Обсудить задачу</span></button>
    <noscript><p>Для отправки заявки включите JavaScript в браузере.</p></noscript>
    <p class="form-status" id="form-status" role="status"></p>
    <div class="form-notes">
      <p class="consent-note"><a href="/privacy">Политика конфиденциальности</a></p>
    </div>
  </form>`;
}

function servicesRows(list, variant = '') {
  return list.map(service => `<article class="service-row ${variant}"><h3 class="direction-title">${escape(service.name)}</h3><p class="service-price">${service.price ? escape(service.price) : ''}</p><a class="button button-red" href="/services/${escape(service.slug)}">Подробнее</a></article>`).join('');
}

function renderServiceSection(section) {
  const paragraphs = (section.paragraphs || []).map(paragraph => `<p>${escape(paragraph)}</p>`).join('');
  const items = (section.items || []).length ? `<ol class="service-detail-list">${section.items.map(([title, text]) => `<li><div><h4>${brandText(title)}</h4><p>${escape(text)}</p></div></li>`).join('')}</ol>` : '';
  return `<article class="service-detail-section"><div><h3>${brandText(section.title)}</h3>${paragraphs}${items}</div></article>`;
}

function renderServiceSearchContent(service) {
  const faq = renderAnswers(getServiceFaq(service));
  const related = (relatedServiceSlugs[service.slug] || []).map(slug => `<a href="/services/${escape(slug)}">${escape(serviceSearchLabels[slug])}</a>`).join('');
  return `<section class="service-search-content" aria-labelledby="service-questions"><h2 id="service-questions">Вопросы перед началом работы</h2>${faq}${related ? `<nav class="related-services" aria-label="Связанные услуги"><h3>Смежные решения</h3>${related}</nav>` : ''}</section>`;
}

function renderAnswers(answers) {
  return answers.map(([question, answer]) => `<details class="service-faq-item"><summary><h3>${brandText(question)}</h3></summary><p>${escape(answer)}</p></details>`).join('');
}

function questionSection(answers, id) {
  return `<section class="service-search-content" aria-labelledby="${id}"><h2 id="${id}">Вопросы перед началом работы</h2>${renderAnswers(answers)}</section>`;
}

function goalScenarios(slug) {
  return `<section class="service-search-content" aria-labelledby="goal-scenarios"><h2 id="goal-scenarios">От задачи к решению</h2>${goalContent[slug].scenarios.map(([problem, solution, tools, result]) => `<article class="service-faq-item"><h3>${escape(problem)}</h3><p><strong>Решение:</strong> ${escape(solution)}</p><p><strong>Инструменты:</strong> ${escape(tools)}</p><p><strong>Результат:</strong> ${escape(result)}</p></article>`).join('')}</section>`;
}

function serviceDetails(service) {
  const telegram = telegramDraft(`Здравствуйте! Хочу обсудить задачу связанную с услугой "${service.name}"`);
  const entryPriceNote = service.price.startsWith('от ') ? '<p class="entry-price-note">Цена с пометкой «от» — это минимальный бюджет входа в разработку или продвижение. Точная стоимость зависит от объёма и сложности задачи и фиксируется до начала работ.</p>' : '';
  return `<section class="service-detail"><div class="service-detail-intro"><p class="section-label">Решение под задачу бизнеса</p><h2 class="direction-title">${brandText(service.title)}</h2><p class="service-summary">${escape(service.subtitle)}</p><dl class="service-facts">${service.facts.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>${entryPriceNote}</div><div class="service-detail-body">${service.sections.map(renderServiceSection).join('')}${renderServiceSearchContent(service)}</div><div class="service-write"><a class="button button-red button-shine" href="${escape(telegram.href)}" target="_blank" rel="noreferrer">Написать в Telegram</a><a class="button button-red button-shine" href="tel:${escape(agencyProfile.phone)}">Позвонить</a></div><div class="service-cta-panel"><div><p class="section-label">Обсудим вашу задачу</p><h3>${escape(service.cta)}</h3></div></div></section>`;
}

function telegramDraft(message) {
  const url = new URL(config.contacts.telegram.url);
  url.search = 'text=' + encodeURIComponent(message);
  return url;
}

const goals = {
  'more-clients': {
    title: 'Хочу больше клиентов',
    description: 'Поможем клиентам найти вас, а посетителям сайта — сделать следующий шаг: оставить заявку или оформить заказ.',
    services: ['geo', 'seo', 'seo-blog', 'web-analytics', 'conversion-optimization', 'web-design', 'data-parsers']
  },
  'less-manual-work': {
    title: 'Хочу меньше ручной работы',
    description: 'Автоматизируем рутину, свяжем ваши системы и освободим время команды для работы с клиентами.',
    services: ['ai-automation', 'chatbots', 'custom-crm', 'integrations', 'data-parsers']
  },
  'launch-product': {
    title: 'Хочу запустить цифровой продукт',
    description: 'Поможем проверить идею и выпустить то, чем смогут пользоваться клиенты: сайт, приложение или онлайн-сервис.',
    services: ['websites', 'chatbots', 'mvp-prototypes', 'web-apps', 'mobile-apps', 'mini-apps', 'desktop-apps']
  }
};

function businessGoals() {
  const cards = Object.entries(goals).map(([slug, goal]) => `<article class="goal-card">
    <h3 id="goal-${slug}">${escape(goal.title)}</h3>
    <a class="button button-red" href="/goals/${slug}" aria-labelledby="goal-link-${slug} goal-${slug}"><span id="goal-link-${slug}">Посмотреть решение</span></a>
  </article>`).join('');
  return `<section class="services-section business-goals" id="services"><h2>Что требуется вашему бизнесу?</h2><div class="goals-grid">${cards}</div></section>`;
}

function goalPage(slug) {
  const goal = Object.hasOwn(goals, slug) ? goals[slug] : null;
  if (!goal) return notFound();
  const catalog = [...config.services, ...config.otherServices];
  const services = goal.services.map(id => catalog.find(service => service.slug === id));
  return `${innerHeader(goal.title, 'ЗАДАЧА БИЗНЕСА', '/#services', 'direction-title')}<section class="services-section goal-solutions">
    <div class="section-heading"><div><h2>Подходящие решения</h2></div><div class="section-heading-copy">
      <p>${escape(goalContent[slug].summary)}</p>
      <p>Цены с пометкой «от» — минимальная стоимость входа в разработку или продвижение.</p>
    </div></div>${servicesRows(services)}
  </section>${goalScenarios(slug)}${questionSection(goalContent[slug].faq, 'goal-questions')}${footer()}`;
}

function home() {
  return `<section class="hero section-split"><div class="hero-form" id="discuss"><div class="hero-copy"><h1><span class="accent">ОПИШИТЕ ПРОБЛЕМУ,</span><span>КОТОРАЯ МЕШАЕТ</span><span>ЗАРАБАТЫВАТЬ</span></h1><p class="hero-lead">Начнём с проблемы, а не с готового решения. Расскажите, где бизнес теряет время, заявки или деньги. Мы разберём задачу и предложим следующий шаг.</p></div>${form()}</div><div class="hero-brand"><div class="hero-brand-content"><div class="hero-brand-title">АГЕНТСТВО<br />ЦИФРОВЫХ<br />РЕШЕНИЙ<br />ДЛЯ БИЗНЕСА</div><p class="hero-brand-note">Разработка · Автоматизация · Продвижение</p></div><img class="hero-monogram" src="/assets/damvi-avatar-solid-dark.svg" alt="" aria-hidden="true" /></div></section><section class="approach section-split" id="approach"><div class="approach-copy"><h2><span>ПРОБЛЕМА ЕСТЬ —</span>РЕШЕНИЕ НАЙДЁМ</h2><p>${escape(agencyProfile.summary)}</p><p>Мы разбираемся, что именно мешает бизнесу зарабатывать, и создаём цифровые решения под конкретную задачу. Не делаем продукт ради галочки — помогаем бизнесу двигаться вперёд.</p></div><div class="process" aria-label="Процесс работы"><ol><li>Разбираемся</li>${arrow}<li>Проектируем</li>${arrow}<li>Реализуем</li>${arrow}<li>Поддерживаем</li></ol></div></section>${businessGoals()}<section class="works" id="works"><div><h2>НАШИ РАБОТЫ</h2></div><a class="button button-red" href="/projects"><span>Посмотреть проекты</span></a></section>${footer()}`;
}

function innerHeader(title, eyebrow = 'НАПРАВЛЕНИЕ', backHref, headingClass = '') {
  const back = backHref ? `<nav class="service-back" aria-label="Навигация направления"><a class="button button-red button-back" href="${escape(backHref)}">Назад</a></nav>` : '';
  return `<header class="inner-header${backHref ? ' inner-header-with-back' : ''}">${eyebrow ? `<p>${eyebrow}</p>` : ''}<h1 class="${headingClass}">${brandText(title)}</h1>${back}</header>`;
}
function servicePage(slug) {
  if (slug === 'other') return otherPage();
  const service = [...config.services, ...(config.otherServices ?? [])].find(item => item.slug === slug || item.aliases?.includes(slug));
  if (!service) return notFound();
  const parent = config.otherServices?.includes(service) ? '/services/other' : '/#services';
  return `${innerHeader(service.name, 'НАПРАВЛЕНИЕ', parent, 'direction-title')}${serviceDetails(service)}${footer()}`;
}
function otherPage() { return `${innerHeader('Другие направления', 'НАПРАВЛЕНИЕ', '/#services', 'direction-title')}<section class="services-section other-directions"><div class="section-heading"><div><p class="section-label">Дополнительные решения</p><h2 class="direction-title">Другие направления</h2></div><div class="section-heading-copy"><p>Берёмся за задачи, которым нужен отдельный цифровой продукт, интеграция, аналитика, дизайн или контент.</p><p>Цена «от» — минимальная стоимость входа. Точный бюджет фиксируем после уточнения объёма и сложности.</p></div></div>${servicesRows(config.otherServices, 'compact')}</section>${footer()}`; }
function projectsPage() { return `${innerHeader('Наши работы', '', '/#works', 'direction-title')}<section class="projects-page"><div class="section-heading"><div><p class="section-label">Реализованные проекты</p><h2>НАШИ РАБОТЫ</h2></div><div class="section-heading-copy"><p>Сайты и цифровые продукты, которые уже работают для бизнеса.</p></div></div><div class="projects-grid">${config.projects.map(project => `<article class="project-card" id="${escape(project.slug)}"><p class="project-type">${escape(project.type)}</p><h3 class="direction-title">${escape(project.name)}</h3><p class="project-description">${escape(project.description)}</p><a class="button button-red" href="${escape(project.url)}" target="_blank" rel="noreferrer">Открыть проект </a></article>`).join('')}</div></section>${footer()}`; }
function legalPage(doc) {
  const paragraphs = doc.text.split(/\n/).filter(Boolean).slice(1).map(line => {
    const tag = /^\d+\.\s/.test(line) ? 'h2' : 'p';
    return `<${tag}>${escape(line).replaceAll('office@damvi.ru', '<a href="mailto:office@damvi.ru">office@damvi.ru</a>')}</${tag}>`;
  }).join('');
  return `${innerHeader(doc.title, 'ДОКУМЕНТ', '/#contact-form')}<article class="legal-document">${paragraphs}<nav aria-label="Правовые документы"><a href="/privacy">Политика обработки данных</a><a href="/consent">Согласие на обработку данных</a><a href="/legal">Информация об исполнителе</a></nav></article>${footer()}`;
}
function notFound() { return `${innerHeader('Страница не найдена', '404', '/')}<section class="empty-state"><a class="button button-red" href="/">На главную</a></section>${footer()}`; }

let renderVersion = 0;
let renderedPath = document.querySelector('#page-content')?.dataset.renderedPath;
async function render() {
  const version = ++renderVersion;
  const path = window.location.pathname.slice(basePath.length).replace(/\/$/, '') || '/';
  const main = document.querySelector('#page-content');
  if (path === renderedPath) return;
  const slug = path.split('/').pop();
  const isGoal = /^\/goals\/[^/]+$/.test(path);
  const isService = path.startsWith('/services/');
  const needsCatalog = (isGoal && Object.hasOwn(goals, slug)) ||
    (isService && !config.services.some(service => service.slug === slug || service.aliases?.includes(slug)));
  if (needsCatalog && !config.otherServices) {
    try {
      const { otherServices } = await import('./other-services.js');
      config.otherServices = otherServices;
    } catch {
      if (version === renderVersion) {
        main.innerHTML = '<section class="empty-state"><p>Не удалось загрузить направление.</p><button class="button button-red" type="button">Повторить</button></section>';
        main.querySelector('button').onclick = () => location.reload();
        renderedPath = undefined;
        setupProcess();
      }
      return;
    }
    if (version !== renderVersion) return;
  }
  let legalDoc;
  if (['/privacy', '/consent', '/legal'].includes(path)) {
    const { legalDocuments } = await import('./legal-documents.js');
    if (version !== renderVersion) return;
    legalDoc = legalDocuments[path.slice(1)];
  }
  let content = path === '/' ? home() : path === '/projects' ? projectsPage() : legalDoc ? legalPage(legalDoc) : isGoal ? goalPage(slug) : isService ? servicePage(slug) : notFound();
  main.innerHTML = withBasePath(content);
  applyPageSeo(getPageSeo(path, [...config.services, ...(config.otherServices || [])], goals, { indexable: location.hostname === 'damvi.ru' }));
  renderedPath = path;
  setupForm();
  setupProcess();
  setupProjectCards();
  setupButtonShine();
}

let projectCardObserver;
let projectFitFrame;
function setupProjectCards() {
  projectCardObserver?.disconnect();
  cancelAnimationFrame(projectFitFrame);
  projectFitFrame = undefined;
  const descriptions = document.querySelectorAll('.project-description');
  if (!descriptions.length) return;
  const dimensions = new WeakMap();
  const pending = new Set();
  const sizes = new WeakMap();
  function measure() {
    // Read every card first, then write styles; no write/read loop per pixel.
    const measurements = [...pending].filter(el => el.isConnected).map(el => ({ el, overflow: el.scrollHeight > el.clientHeight + 1, size: sizes.get(el) ?? 17 }));
    pending.clear();
    for (const { el, overflow, size } of measurements) {
      if (overflow && size > 14) {
        sizes.set(el, size - 1);
        el.style.fontSize = (size - 1) + 'px';
        pending.add(el);
      } else el.tabIndex = overflow ? 0 : -1;
    }
    projectFitFrame = pending.size ? requestAnimationFrame(measure) : undefined;
  }
  function schedule(description) {
    if (!description.isConnected) return;
    description.style.fontSize = '17px';
    sizes.set(description, 17);
    pending.add(description);
    if (!projectFitFrame) projectFitFrame = requestAnimationFrame(measure);
  }
  descriptions.forEach(schedule);
  if ('ResizeObserver' in window) {
    projectCardObserver = new ResizeObserver(entries => {
      for (const { target, contentRect } of entries) {
        const previous = dimensions.get(target);
        dimensions.set(target, [contentRect.width, contentRect.height]);
        if (!previous || Math.abs(previous[0] - contentRect.width) > .5 || Math.abs(previous[1] - contentRect.height) > .5) schedule(target);
      }
    });
    descriptions.forEach(description => projectCardObserver.observe(description));
  }
}

let shineObserver;
function setupButtonShine() {
  shineObserver?.disconnect();
  const buttons = document.querySelectorAll('.button-shine');
  const visible = new Set();
  const update = () => buttons.forEach(button => button.classList.toggle('is-shine-visible', !document.hidden && visible.has(button)));
  document.onvisibilitychange = update;
  if (!('IntersectionObserver' in window)) {
    buttons.forEach(button => visible.add(button));
    update();
    return;
  }
  shineObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => isIntersecting ? visible.add(target) : visible.delete(target));
    update();
  });
  buttons.forEach(button => shineObserver.observe(button));
}

async function renderAtPosition(state, behavior = 'instant', { initial = false } = {}) {
  const rendered = render();
  const version = renderVersion;
  await rendered;
  if (version !== renderVersion) return;
  // A prerendered page is already visible: do not reset an early user scroll.
  if (initial && !state?.damviScroll && !location.hash) return;
  if (state?.damviScroll || location.hash) {
    await document.fonts.ready;
    if (version !== renderVersion) return;
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) behavior = 'instant';
  if (state?.damviScroll) {
    const { x, y } = state.damviScroll;
    window.scrollTo({ left: x, top: y, behavior: 'instant' });
  } else if (location.hash) {
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior });
  } else {
    window.scrollTo({ left: 0, top: 0, behavior });
  }
}

let processObserver;
function setupProcess() {
  processObserver?.disconnect();
  const process = document.querySelector('.process');
  if (!process || !('IntersectionObserver' in window)) return;
  process.classList.add('process-animated');
  processObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
  process.querySelectorAll('li, .process-arrow').forEach(item => processObserver.observe(item));
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
  if (!data.problem) errors.problem = 'Опишите задачу.';
  else if ([...data.problem].length > 2500) errors.problem = 'Сократите описание до 2500 символов.';
  const email = /^[\w!#$%&'*+\/=?^{}|~-]+(?:\.[\w!#$%&'*+\/=?^{}|~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
  const telegram = /^(?:@[a-z0-9_]{5,32}|(?:https?:\/\/)?(?:t\.me|telegram\.me)\/[a-z0-9_]{5,32}\/?)$/i;
  if (!data.contact) errors.contact = 'Укажите, куда вам ответить.';
  else if (data.contact.length > 254 || !(email.test(data.contact) || telegram.test(data.contact))) errors.contact = 'Укажите корректный email, @username или ссылку t.me.';
  if (!data.phone || data.phone === '+7') errors.phone = 'Укажите номер для связи.';
  else if (!/^\+7[0-9 ().-]{10,30}$/.test(data.phone) || !/^7\d{10}$/.test(data.phone.replace(/\D/g, ''))) errors.phone = 'Введите 10 цифр после +7.';
  if (data.consent !== true) errors.consent = 'Подтвердите согласие на обработку персональных данных.';
  for (const key of ['problem', 'contact', 'phone']) {
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(data[key])) errors[key] = 'Удалите недопустимые символы.';
  }
  return errors;
}
function setupForm() {
  const formEl = document.querySelector('#contact-form');
  if (!formEl) return;
  const problem = formEl.elements.problem;
  formEl.addEventListener('pointerdown', event => {
    if (event.target === problem || event.target.closest('input, button, a, label')) return;
    const rect = problem.getBoundingClientRect();
    if (event.clientX >= rect.left - 6 && event.clientX <= rect.right + 6 && event.clientY >= rect.top - 6 && event.clientY <= rect.bottom + 6) {
      event.preventDefault();
      problem.focus();
    }
  });
  const trap = document.createElement('input');
  trap.name = 'website'; trap.tabIndex = -1; trap.autocomplete = 'off'; trap.className = 'sr-only'; trap.setAttribute('aria-hidden', 'true'); formEl.append(trap);
  const button = formEl.querySelector('button[type="submit"]');
  button.disabled = false;
  const buttonLabel = button.querySelector('.form-submit-label');
  const status = formEl.querySelector('#form-status');
  const phone = formEl.elements.phone;
  const placeCaretAfterPrefix = () => {
    if (!phone.value) phone.value = '+7';
    if (phone.value === '+7') phone.setSelectionRange(2, 2);
  };
  phone.addEventListener('focus', placeCaretAfterPrefix);
  phone.addEventListener('click', placeCaretAfterPrefix);
  phone.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '');
    const hasPrefix = phone.value.startsWith('+7') || (/^[78]/.test(digits) && digits.length === 11);
    const number = (hasPrefix ? digits.slice(1) : digits).slice(0, 10);
    let value = '+7';
    if (number) value += ' (' + number.slice(0, 3);
    if (number.length > 3) value += ') ' + number.slice(3, 6);
    if (number.length > 6) value += '-' + number.slice(6, 8);
    if (number.length > 8) value += '-' + number.slice(8);
    phone.value = value;
  });

  function showErrors(errors) {
    let firstInvalid;
    for (const key of ['problem', 'contact', 'phone', 'consent']) {
      const message = errors[key] || '';
      const field = formEl.elements[key];
      formEl.querySelector('#' + key + '-error').textContent = message;
      field.setAttribute('aria-invalid', String(Boolean(message)));
      if (message && !firstInvalid) firstInvalid = field;
    }
    firstInvalid?.focus();
    return Boolean(firstInvalid);
  }

  formEl.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    const data = {
      problem: formEl.elements.problem.value.trim(),
      contact: formEl.elements.contact.value.trim(),
      phone: formEl.elements.phone.value.trim(),
      consent: formEl.elements.consent.checked,
      website: trap.value
    };
    status.textContent = '';
    status.className = 'form-status';
    if (location.hostname === 'damvi.ru' && location.protocol !== 'https:') {
      status.classList.add('is-error');
      status.textContent = 'Для безопасной отправки заявки откройте https://damvi.ru. Защищённое соединение должно быть доступно.';
      return;
    }
    if (showErrors(validateClient(data))) return;
    if (pages) {
      status.classList.add('is-error');
      status.textContent = 'Это тестовая версия сайта. Отправка формы будет доступна на основном сайте. Напишите на office@damvi.ru.';
      return;
    }
    button.disabled = true;
    buttonLabel.textContent = 'Отправляем…';
    const fallback = 'Не удалось отправить заявку. Попробуйте ещё раз или напишите на office@damvi.ru.';
    try {
      const response = await fetch('/api/contact.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        if (!showErrors(result?.errors || {})) {
          status.classList.add('is-error');
          status.textContent = result?.message || fallback;
        }
        return;
      }
      formEl.style.minHeight = formEl.offsetHeight + 'px';
      formEl.classList.add('is-sent');
      formEl.innerHTML = `<div class="form-confirmation" tabindex="-1">
        <svg class="form-confirmation-check" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M15 33l11 11 23-25" pathLength="1" />
        </svg>
        <p><strong>Заявка отправлена</strong></p>
        <p>Напишем вам по указанному контакту.</p>
      </div>`;
      formEl.querySelector('.form-confirmation').focus({ preventScroll: true });
    } catch {
      status.classList.add('is-error');
      status.textContent = fallback;
    } finally {
      button.disabled = false;
      buttonLabel.textContent = 'Обсудить задачу';
    }
  });
}
history.scrollRestoration = 'manual';
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="/"]');
  if (!link || link.origin !== location.origin || link.target === '_blank' || link.hasAttribute('download') || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  history.replaceState({ ...history.state, damviScroll: { x: scrollX, y: scrollY } }, '');
  if (link.matches('.button-back') && history.state?.damviReturn) {
    history.back();
    return;
  }
  const samePage = link.pathname === location.pathname;
  if (link.href !== location.href) {
    history.pushState({ damviReturn: !samePage || history.state?.damviReturn === true }, '', link.href);
  }
  renderAtPosition(null, samePage ? 'smooth' : 'instant');
});
window.addEventListener('popstate', event => renderAtPosition(event.state));
if (!document.querySelector('#page-content')) document.querySelector('#app').innerHTML = withBasePath(`${siteNav()}<main id="page-content"></main>`);
setupNav();
if (renderedPath) { setupForm(); setupProcess(); setupProjectCards(); setupButtonShine(); }
renderAtPosition(history.state, 'instant', { initial: true });
