// Shared by the static build and client navigation. No tracking or external requests.
export const SITE_ORIGIN = 'https://damvi.ru';
const serviceTitles = {
  websites: 'Разработка сайтов под ключ для бизнеса',
  chatbots: 'Разработка чат-ботов для бизнеса: Telegram, VK и MAX',
  'ai-automation': 'Внедрение ИИ в бизнес и автоматизация процессов',
  geo: 'GEO-продвижение сайта в нейросетях',
  seo: 'Настройка SEO сайта: базовая техническая оптимизация',
  'seo-blog': 'Создание и ведение SEO-блога для бизнеса',
  'web-apps': 'Разработка веб-приложений и онлайн-сервисов',
  'mvp-prototypes': 'Разработка MVP и прототипов для стартапов',
  'mobile-apps': 'Разработка мобильных приложений для iOS и Android',
  'desktop-apps': 'Разработка десктопных приложений для бизнеса',
  'mini-apps': 'Разработка Telegram Mini Apps и VK Mini Apps',
  'custom-crm': 'Разработка CRM-систем для бизнеса на заказ',
  integrations: 'Интеграция сайта с CRM, сервисами и API',
  'data-parsers': 'Разработка парсеров и обработка данных на заказ',
  'web-analytics': 'Настройка веб-аналитики и Яндекс Метрики',
  'conversion-optimization': 'Оптимизация конверсии сайта для бизнеса',
  'web-design': 'Веб-дизайн: разработка дизайна сайта для бизнеса'
};
const serviceDescriptions = {
  websites: 'Разработка сайтов под ключ: лендинги, корпоративные сайты и интернет-магазины. Адаптивный дизайн, формы заявок и интеграции.',
  chatbots: 'Разработка чат-ботов для Telegram, VK, MAX и сайта: консультации, заявки, запись клиентов, оплата и интеграция с CRM.',
  'ai-automation': 'Внедрение ИИ в бизнес: ассистенты, обработка заявок и документов, автоматизация повторяющихся операций и связь с рабочими сервисами.',
  geo: 'GEO-продвижение сайта и бренда в нейросетях: подготовка контента, структуры и информации о компании для генеративного поиска.',
  seo: 'Базовая настройка SEO сайта: Title, Description, заголовки, robots.txt, sitemap.xml, панели вебмастеров и Open Graph.',
  'seo-blog': 'Создание и ведение SEO-блога: подбор тем, экспертные статьи, метатеги, перелинковка с услугами и публикация материалов.',
  'web-apps': 'Разработка веб-приложений и онлайн-сервисов: личные кабинеты, платформы, калькуляторы, бронирование и внутренние системы.',
  'mvp-prototypes': 'Разработка MVP и прототипов для проверки идеи: пользовательские сценарии, ключевые функции и первая версия цифрового продукта.',
  'mobile-apps': 'Разработка мобильных приложений для iOS и Android: проектирование, дизайн, серверная логика, интеграции и подготовка к публикации.',
  'desktop-apps': 'Разработка приложений для Windows, macOS и Linux: внутренние программы, обработка файлов и данных, интеграции и обновления.',
  'mini-apps': 'Разработка Telegram Mini Apps и VK Mini Apps: магазины, каталоги, кабинеты, бронирование и программы лояльности внутри мессенджеров.',
  'custom-crm': 'Разработка CRM-систем на заказ: клиенты, сделки, задачи, документы, права доступа, отчёты и интеграции под процессы компании.',
  integrations: 'Интеграция сайта с CRM, телефонией, оплатой и мессенджерами. Обмен данными через API и вебхуки вместо ручного копирования.',
  'data-parsers': 'Разработка парсеров: законный сбор открытых данных, очистка, преобразование, выгрузка в таблицы и интеграция с рабочими системами.',
  'web-analytics': 'Настройка веб-аналитики: Яндекс Метрика, цели и события, источники трафика, заявки, покупки и анализ поведения посетителей.',
  'conversion-optimization': 'Оптимизация конверсии сайта: анализ пользовательского пути, форм, посадочных страниц и препятствий перед заявкой или покупкой.',
  'web-design': 'Веб-дизайн для бизнеса: структура страниц, UX/UI, прототипы и адаптивные интерфейсы сайтов, кабинетов и онлайн-сервисов.'
};
const goalMeta = {
  'more-clients': ['Привлечение клиентов: SEO, GEO и конверсия сайта', 'Помогаем бизнесу получать обращения: базовое SEO, GEO-продвижение, SEO-блог, веб-аналитика, дизайн и оптимизация конверсии. Решения DAMVI.'],
  'less-manual-work': ['Автоматизация бизнеса и сокращение ручной работы', 'ИИ, чат-боты, собственная CRM, интеграции и обработка данных. Подбираем решение для автоматизации процессов вашей компании. DAMVI.'],
  'launch-product': ['Разработка цифровых продуктов для бизнеса', 'Разработка сайтов, веб-сервисов, MVP, мобильных и десктопных приложений, чат-ботов и Mini Apps. От идеи до запуска с DAMVI.']
};
const legalMeta = {
  privacy: ['Политика обработки персональных данных', 'Порядок обработки персональных данных, цели, сроки хранения, права заявителей и контакты оператора DAMVI.'],
  consent: ['Согласие на обработку персональных данных', 'Отдельное согласие для заявки DAMVI: состав данных, цели обработки, сроки и отзыв по адресу info@damvi.ru.'],
  legal: ['Информация об исполнителе и услугах', 'Информация об исполнителе DAMVI, согласовании задач, стоимости, оплате, чеках и порядке обращений заказчиков.']
};

export function getPageSeo(path, services = [], goals = {}, { origin = SITE_ORIGIN, indexable = true } = {}) {
  path = path.replace(/\/$/, '') || '/';
  const slug = path.split('/').pop();
  const service = path.startsWith('/services/') ? services.find(s => s.slug === slug || s.aliases?.includes(slug)) : null;
  const goal = path.startsWith('/goals/') && Object.hasOwn(goals, slug) ? goals[slug] : null;
  let title, description, canonicalPath = path, noindex = !indexable;
  if (path === '/') {
    title = 'DAMVI — агентство цифровых решений для бизнеса';
    description = 'DAMVI — цифровое агентство для бизнеса: разработка сайтов и приложений, внедрение ИИ, автоматизация, чат-боты, SEO и GEO-продвижение. Работаем удалённо по России.';
  } else if (service) {
    title = `${serviceTitles[service.slug] || service.title} — DAMVI`;
    const summary = serviceDescriptions[service.slug] || service.subtitle.split(/(?<=[.!?])\s/)[0];
    description = `${summary} ${service.price[0].toUpperCase() + service.price.slice(1)}. DAMVI.`;
    canonicalPath = '/services/' + service.slug;
  } else if (goal) {
    [title, description] = goalMeta[slug];
    title += ' — DAMVI';
  } else if (path === '/services/other') {
    title = 'Услуги разработки, интеграций, аналитики и дизайна — DAMVI';
    description = 'Веб-приложения, MVP, мобильные приложения, CRM, интеграции, парсеры, аналитика, оптимизация конверсии и веб-дизайн. Решения DAMVI под задачи бизнеса.';
  } else if (path === '/projects') {
    title = 'Наши работы: сайты и цифровые проекты — DAMVI';
    description = 'Проекты DAMVI: сайт платформы Insol для оценки и подбора AI-разработчиков и интеграторов, сайт ресторана «Кинкали». Откройте работающие сайты.';
  } else if (Object.hasOwn(legalMeta, slug) && path === '/' + slug) {
    [title, description] = legalMeta[slug];
    title += ' — DAMVI';
    // Unapproved privacy/consent drafts must not appear as the production policy.
    if (slug !== 'legal') noindex = true;
  } else {
    title = 'Страница не найдена — DAMVI';
    description = 'Запрошенная страница DAMVI не найдена. Перейдите на главную страницу или выберите услугу.';
    noindex = true;
  }
  const canonical = origin + (canonicalPath === '/' ? '/' : canonicalPath);
  const graph = [{ '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: 'DAMVI', alternateName: 'Дамви', inLanguage: 'ru-RU' }];
  const page = { '@type': goal || path === '/services/other' || path === '/projects' ? 'CollectionPage' : 'WebPage', '@id': canonical + '#page', url: canonical, name: title, description, inLanguage: 'ru-RU', isPartOf: { '@id': origin + '/#website' } };
  graph.push(page);
  if (service) {
    const entity = { '@type': 'Service', '@id': canonical + '#service', name: service.title, serviceType: service.name, description: service.subtitle, url: canonical, areaServed: { '@type': 'Country', name: 'Россия' }, brand: { '@type': 'Brand', name: 'DAMVI' } };
    graph.push(entity);
    page.mainEntity = { '@id': entity['@id'] };
  }
  if (path !== '/' && title !== 'Страница не найдена — DAMVI') {
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DAMVI', item: origin + '/' }, { '@type': 'ListItem', position: 2, name: service?.name || goal?.title || title.replace(' — DAMVI', ''), item: canonical }] });
  }
  return { title, description, canonical, noindex, jsonLd: { '@context': 'https://schema.org', '@graph': graph } };
}

export function applyPageSeo(seo) {
  document.title = seo.title;
  function meta(key, value, property = false) {
    const attr = property ? 'property' : 'name';
    let node = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!node) { node = document.createElement('meta'); node.setAttribute(attr, key); document.head.append(node); }
    node.content = value;
  }
  meta('description', seo.description);
  meta('robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
  meta('og:title', seo.title, true); meta('og:description', seo.description, true);
  meta('og:url', seo.canonical, true); meta('og:site_name', 'DAMVI', true);
  meta('og:type', 'website', true); meta('og:locale', 'ru_RU', true);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
  canonical.href = seo.canonical;
  let structured = document.getElementById('site-structured-data');
  if (!structured) { structured = document.createElement('script'); structured.id = 'site-structured-data'; structured.type = 'application/ld+json'; document.head.append(structured); }
  structured.textContent = JSON.stringify(seo.jsonLd);
}
