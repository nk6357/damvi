import { createHash } from 'node:crypto';
import { agencyProfile, homeFaq, goalContent } from '../public/search-content.js';
import { getServiceFaq } from '../public/service-search-content.js';
import { getPageSeo, SITE_ORIGIN } from '../public/seo.js';

export function pageFingerprint(path, model) {
  const seo = getPageSeo(path, model.services, model.goals);
  return createHash('sha256').update(JSON.stringify([model.content(path), seo.title, seo.description, seo.jsonLd])).digest('hex');
}
export function robotsText(preview = false) {
  const policy = 'Allow: /\nDisallow: /api/\nDisallow: /_pages/\n';
  const names = preview ? ['*'] : ['*', 'Yandex', 'Googlebot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Google-Extended', 'TelegramBot', 'vkShare'];
  return names.map(name => `User-agent: ${name}\n${policy}`).join('\n') + (preview ? '' : `\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
}
const link = (path, label) => `- [${label}](${SITE_ORIGIN}${path})`;
export function llmDocuments(model) {
  const intro = `# Damvi — агентство цифровых решений для бизнеса\n\n> ${agencyProfile.summary}\n\n${agencyProfile.status}\n`;
  const contacts = `\n## Контакты\n\n- Email: ${agencyProfile.email}\n- Telegram: ${agencyProfile.telegram}\n- Телефон: ${agencyProfile.phone}\n- Обсудить задачу: ${SITE_ORIGIN}/#contact-form\n`;
  const legal = `\n## Правовая информация\n\n${link('/legal', 'Исполнитель и порядок заказа услуг')}\n${link('/privacy', 'Политика обработки персональных данных')}\n${link('/consent', 'Отдельное согласие для формы заявки')}\n`;
  const short = intro + '\n## Основные разделы\n\n' + [link('/', 'Главная — задачи бизнеса и обращение в Damvi'), link('/projects', 'Работы — Insol и «Кинкали»'), link('/services/other', 'Другие направления — каталог дополнительных решений'), ...Object.entries(model.goals).map(([slug, item]) => link('/goals/' + slug, item.title))].join('\n')
    + '\n\n## Услуги\n\n' + model.services.map(item => link('/services/' + item.slug, `${item.name} — ${item.price}`)).join('\n') + contacts + legal;
  const answerText = (answers, level = 3) => answers.map(([q, a]) => `${'#'.repeat(level)} ${q}\n\n${a}\n`).join('\n');
  let full = intro + '\n## Как строится работа\n\n' + agencyProfile.process.map((item, i) => `${i + 1}. ${item}`).join('\n') + '\n\n' + answerText(homeFaq);
  full += '\n## Задачи бизнеса\n\n' + Object.entries(model.goals).map(([slug, goal]) => {
    const content = goalContent[slug];
    return `### ${goal.title}\n\nURL: ${SITE_ORIGIN}/goals/${slug}\n\n${content.summary}\n\n` + content.scenarios.map(([p, s, t, r]) => `- Проблема: ${p}\n  Решение: ${s}\n  Инструменты: ${t}\n  Результат: ${r}`).join('\n\n') + '\n\n' + answerText(content.faq, 4);
  }).join('\n');
  full += '\n## Услуги\n\n' + model.services.map(service => {
    const facts = (service.facts || []).map(([name, value]) => `- ${name}: ${value}`).join('\n');
    const sections = (service.sections || []).map(section => `#### ${section.title}\n\n${(section.paragraphs || []).join('\n\n')}\n\n${(section.items || []).map(([title, text]) => `- ${title}: ${text}`).join('\n')}`).join('\n\n');
    return `### ${service.name}\n\nURL: ${SITE_ORIGIN}/services/${service.slug}\n\n${service.subtitle}\n\nСтоимость: ${service.price}. Цена «от» — минимальная стоимость входа; точный объём и бюджет согласуются отдельно.\n\n${facts}\n\n${sections}\n\n${answerText(getServiceFaq(service), 4)}`;
  }).join('\n\n');
  full += '\n## Показанные работы\n\n' + model.config.projects.map(project => `### ${project.name}\n\n${project.description}\n\nПроект: ${project.url}\nКарточка: ${SITE_ORIGIN}/projects#${project.slug}\n`).join('\n');
  full += contacts + legal;
  return { short, full };
}
