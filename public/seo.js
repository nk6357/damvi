// Shared by the static build and client navigation. No tracking or external requests.
import { agencyProfile, homeFaq, goalContent } from './search-content.js';
import { getServiceFaq } from './service-search-content.js';
export const SITE_ORIGIN = 'https://damvi.ru';
export const OG_IMAGE = SITE_ORIGIN + '/assets/og-image.jpg';
// Preserve the existing expanded agency description while keeping the search snippet concise.
const agencyDescription = 'Damvi — цифровое агентство для бизнеса из Перми: сайты, приложения, ИИ, автоматизация, чат-боты, SEO и GEO-продвижение. Работаем удалённо по всей России. Агентство цифровых услуг и digital-решений: полный цикл работы над согласованным цифровым продуктом — от разбора задачи и проектирования до реализации и поддержки.';
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
  'more-clients': ['Привлечение клиентов: SEO, GEO и конверсия сайта', 'Помогаем бизнесу получать обращения: базовое SEO, GEO-продвижение, SEO-блог, веб-аналитика, дизайн и оптимизация конверсии. Решения Damvi. Обсудим задачу.'],
  'less-manual-work': ['Автоматизация бизнеса и сокращение ручной работы', 'ИИ, чат-боты, собственная CRM, интеграции и обработка данных. Подбираем решение для автоматизации процессов вашей компании. Damvi. Обсудим ваш процесс.'],
  'launch-product': ['Разработка цифровых продуктов для бизнеса', 'Разработка сайтов, веб-сервисов, MVP, мобильных и десктопных приложений, чат-ботов и Mini Apps. От идеи до запуска с Damvi. Обсудим первую версию.']
};
const legalMeta = {
  privacy: ['Политика обработки персональных данных', 'Политика Damvi: какие данные нужны для заявки, как они поступают на office@damvi.ru, сколько хранятся и как запросить доступ, исправление или удаление.'],
  consent: ['Согласие на обработку персональных данных', 'Отдельное согласие для формы Damvi: описание задачи, контакт и телефон, цель обработки, сроки хранения и порядок отзыва по адресу office@damvi.ru.'],
  legal: ['Информация об исполнителе и услугах', 'Кто оказывает услуги под брендом Damvi: самозанятый исполнитель, согласование задачи, цены и сроки, договор, оплата, чеки и обращения на office@damvi.ru.']
};

export function getPageSeo(path, services = [], goals = {}, { origin = SITE_ORIGIN, indexable = true } = {}) {
  path = path.replace(/\/$/, '') || '/';
  const slug = path.split('/').pop();
  const service = path.startsWith('/services/') ? services.find(s => s.slug === slug || s.aliases?.includes(slug)) : null;
  const goal = path.startsWith('/goals/') && Object.hasOwn(goals, slug) ? goals[slug] : null;
  let title, description, canonicalPath = path, noindex = !indexable;
  if (path === '/') {
    title = 'Damvi — агентство цифровых решений: разработка, автоматизация, продвижение';
    description = 'Damvi — агентство цифровых решений из Перми: сайты, чат-боты, ИИ, автоматизация, SEO и GEO. Работаем удалённо по всей России. Обсудим задачу бизнеса.';
  } else if (service) {
    title = `${serviceTitles[service.slug] || service.title} — Damvi`;
    const summary = serviceDescriptions[service.slug] || service.subtitle.split(/(?<=[.!?])\s/)[0];
    description = `${summary} ${service.price[0].toUpperCase() + service.price.slice(1)}. Damvi.`;
    canonicalPath = '/services/' + service.slug;
  } else if (goal) {
    [title, description] = goalMeta[slug];
    title += ' — Damvi';
  } else if (path === '/services/other') {
    title = 'Услуги разработки, интеграций, аналитики и дизайна — Damvi';
    description = 'Веб-приложения, MVP, мобильные приложения, CRM, интеграции, парсеры, аналитика, оптимизация конверсии и веб-дизайн. Решения Damvi под задачи бизнеса.';
  } else if (path === '/projects') {
    title = 'Проекты Damvi — сайты для бизнеса и цифровые решения';
    description = 'Проекты Damvi: сайт платформы Insol для оценки и подбора AI-разработчиков и интеграторов, сайт ресторана «Кинкали». Откройте работающие сайты.';
  } else if (Object.hasOwn(legalMeta, slug) && path === '/' + slug) {
    [title, description] = legalMeta[slug];
    title += ' — Damvi';
  } else {
    title = 'Страница не найдена — Damvi';
    description = 'Запрошенная страница Damvi не найдена. Перейдите на главную страницу или выберите услугу.';
    noindex = true;
  }
  const canonical = origin + (canonicalPath === '/' ? '/' : canonicalPath);
  const graph = [{ '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: 'Damvi', alternateName: 'Дамви', inLanguage: 'ru-RU' }];
  const brandId = origin + '/#brand';
  graph.push({ '@type': 'Brand', '@id': brandId, name: 'Damvi', alternateName: 'Дамви', url: origin + '/', logo: origin + '/assets/damvi-logo-white.svg', sameAs: [agencyProfile.telegram], description: 'Цифровые решения для бизнеса: разработка, автоматизация и продвижение.' });
  graph[0].publisher = { '@id': origin + '/legal#provider' };
  const page = { '@type': goal || path === '/services/other' || path === '/projects' ? 'CollectionPage' : 'WebPage', '@id': canonical + '#page', url: canonical, name: title, description, inLanguage: 'ru-RU', isPartOf: { '@id': origin + '/#website' } };
  graph.push(page);
  if (path === '/') {
    // Summarize the agency and process already represented by the homepage.
    // Do not recreate deleted FAQ or city lists as hidden structured content.
    graph[0].description = agencyDescription;
    page.about = { '@type': 'Brand', '@id': origin + '/#brand', name: 'Damvi', description: 'Цифровые решения для бизнеса: разработка, автоматизация и продвижение.' };
  }
  if (service) {
    const entity = { '@type': 'Service', '@id': canonical + '#service', name: service.title, serviceType: service.name, description: service.subtitle, url: canonical, areaServed: { '@type': 'Country', name: 'Россия' }, brand: { '@type': 'Brand', name: 'Damvi' } };
    graph.push(entity);
    entity.brand['@id'] = origin + '/#brand';
    entity.mainEntityOfPage = { '@id': page['@id'] };
    page.mainEntity = { '@id': entity['@id'] };
    entity.provider = { '@id': origin + '/legal#provider' };
  }
  if (path === '/' || goal || path === '/services/other') {
    const groups = path === '/' ? Object.entries(goals).map(([id, item]) => ({ name: item.title, url: origin + '/goals/' + id }))
      : services.filter(item => goal ? goal.services.includes(item.slug) : !['websites', 'chatbots', 'ai-automation', 'geo', 'seo', 'seo-blog'].includes(item.slug))
        .map(item => ({ name: item.name, url: origin + '/services/' + item.slug }));
    const catalogId = canonical + '#catalog';
    graph.push({ '@type': 'OfferCatalog', '@id': catalogId, name: goal?.title || 'Цифровые решения Damvi для бизнеса', itemListElement: groups.map(item => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: item.name, url: item.url } })) });
    page.mainEntity = { '@id': catalogId };
  }
  if (path === '/legal') {
    graph.push({ '@type': 'Person', '@id': origin + '/legal#provider', name: 'Пьянков Никита Алексеевич', url: canonical, email: agencyProfile.email, description: agencyProfile.status });
    page.mainEntity = { '@id': origin + '/legal#provider' };
  }
  const answers = path === '/' ? homeFaq : goal ? goalContent[slug].faq : service ? getServiceFaq(service) : [];
  if (answers.length) {
    const faqId = canonical + '#faq';
    graph.push({ '@type': 'FAQPage', '@id': faqId, isPartOf: { '@id': page['@id'] }, mainEntity: answers.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) });
    page.hasPart = { '@id': faqId };
  }
  if (path !== '/' && title !== 'Страница не найдена — Damvi') {
    const breadcrumbId = canonical + '#breadcrumb';
    graph.push({ '@type': 'BreadcrumbList', '@id': breadcrumbId, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Damvi', item: origin + '/' }, { '@type': 'ListItem', position: 2, name: service?.name || goal?.title || title.replace(' — Damvi', ''), item: canonical }] });
    page.breadcrumb = { '@id': breadcrumbId };
  }
  return { title, description, canonical, noindex, image: OG_IMAGE, jsonLd: { '@context': 'https://schema.org', '@graph': graph } };
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
  meta('og:url', seo.canonical, true); meta('og:site_name', 'Damvi', true);
  meta('og:type', 'website', true); meta('og:locale', 'ru_RU', true);
  meta('og:image', seo.image, true); meta('og:image:secure_url', seo.image, true);
  meta('og:image:type', 'image/jpeg', true); meta('og:image:width', '1200', true); meta('og:image:height', '630', true);
  meta('og:image:alt', 'Damvi — цифровые решения для бизнеса', true);
  meta('twitter:card', 'summary_large_image'); meta('twitter:title', seo.title);
  meta('twitter:description', seo.description); meta('twitter:image', seo.image);
  meta('twitter:image:alt', 'Damvi — цифровые решения для бизнеса');
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
  canonical.href = seo.canonical;
  let structured = document.getElementById('site-structured-data');
  if (!structured) { structured = document.createElement('script'); structured.id = 'site-structured-data'; structured.type = 'application/ld+json'; document.head.append(structured); }
  structured.textContent = JSON.stringify(seo.jsonLd);
}
