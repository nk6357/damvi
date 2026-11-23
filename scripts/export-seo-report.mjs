import { mkdir, writeFile } from 'node:fs/promises';
import { siteModel } from './site-model.mjs';
import { getPageSeo } from '../public/seo.js';
const model = await siteModel();
const rows = [['Страница','Title','Description','Canonical','Индексация основной версии','Услуга / группа','Файл кандидатов','Количество кандидатов','Статус семантики']];
for (const path of model.routes) {
  const seo = getPageSeo(path,model.services,model.goals);
  const service = model.services.find(s=>path==='/services/'+s.slug);
  rows.push([path,seo.title,seo.description,seo.canonical,seo.noindex?'noindex':'index',service?.name || model.goals[path.split('/').pop()]?.title || '',service?'keywords-1000/'+service.slug+'.csv':'',service?'1000':'',service?'Кандидаты; измеренные частоты выделены внутри файла':'Существующая страница, не отдельная услуга']);
}
await mkdir('seo',{recursive:true});
await writeFile('seo/pages.csv','\uFEFF'+rows.map(row=>row.map(v=>'"'+v.replaceAll('"','""')+'"').join(',')).join('\n')+'\n');
console.log('Exported SEO metadata for '+model.routes.length+' pages.');
