import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {siteModel} from '../scripts/site-model.mjs';
import {agencyProfile,goalContent,homeFaq} from '../public/search-content.js';
const root='dist/beget/public_html';
const model=await siteModel();
const short=await readFile(root+'/llms.txt','utf8'), full=await readFile(root+'/llms-full.txt','utf8');
assert.ok(short.startsWith('# Damvi'));
assert.ok(short.includes('office@damvi.ru')&&short.includes('https://t.me/nk6357'));
for(const route of model.routes) assert.ok(short.includes('https://damvi.ru'+route),route+': absent from llms overview');
for(const service of model.services) assert.ok(full.includes(service.name)&&full.includes(service.price)&&full.includes('/services/'+service.slug),service.slug+': incomplete AI summary');
for(const project of model.config.projects) assert.ok(full.includes(project.description)&&full.includes(project.url));
for(const text of [agencyProfile.summary,...Object.values(goalContent).map(v=>v.summary)]) assert.ok(text.split(/\s+/).length>=40&&text.split(/\s+/).length<=60);
assert.equal(homeFaq.length,0);
assert.ok(!/\b(?:localhost|127\.0\.0\.1|github\.io)\b/.test(short+full));
for(const dir of ['dist/local','dist/pages']) await assert.rejects(access(dir+'/llms.txt'));
const sitemap=await readFile(root+'/sitemap.xml','utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,26);
assert.equal((sitemap.match(/<lastmod>/g)||[]).length,26);
assert.ok(!sitemap.includes('/404')&&!sitemap.includes('/services/support'));
const robots=await readFile(root+'/robots.txt','utf8');
for(const name of ['*','Yandex','Googlebot','OAI-SearchBot','ChatGPT-User','PerplexityBot','Google-Extended','TelegramBot','vkShare']) {
 const block=robots.split(/\n\n/).find(b=>b.startsWith('User-agent: '+name+'\n'));
 assert.ok(block&&block.includes('Allow: /\n')&&block.includes('Disallow: /api/')&&block.includes('Disallow: /_pages/'),name+': inconsistent crawler policy');
}
for(const route of model.routes) {
 const html=await readFile(root+(route==='/'?'/index.html':'/_pages'+route+'.html'),'utf8');
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1,route+': canonical duplicates');
 assert.ok(html.includes('name="twitter:card" content="summary_large_image"'),route+': missing Twitter card');
 assert.ok(html.includes('property="og:image" content="https://damvi.ru/assets/og-image.jpg"'),route+': non-raster/relative image');
 assert.ok(html.includes('property="og:image:width" content="1200"')&&html.includes('property="og:image:height" content="630"'));
 if(route==='/404') continue;
 const graph=JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 const expectedFaq=route.startsWith('/goals/')||(route.startsWith('/services/')&&route!=='/services/other');
 assert.equal(graph.some(n=>n['@type']==='FAQPage'),expectedFaq,route+': wrong FAQ scope');
 assert.ok(!graph.some(n=>['Organization','ProfessionalService','LocalBusiness','Review','AggregateRating'].includes(n['@type'])),route+': invented/deprecated business or review markup');
 for(const person of graph.filter(n=>n['@type']==='Person')) assert.ok(route==='/legal'&&html.includes(person.name),route+': unsupported provider identity');
 if(route!=='/legal') assert.ok(!JSON.stringify(graph).includes('Пьянков'),route+': unnecessary personal-name duplication');
}
const image=await readFile(root+'/assets/og-image.jpg');
assert.equal(image.readUInt16BE(0),0xffd8);
assert.ok(image.length<150000,'Social image unnecessarily heavy');
await access(root+'/googlef0cd9bf0538e0e60.html'); await access(root+'/yandex_0af32123aa1d73be.html');
console.log('Search assets passed: 26 metadata sets, dated sitemap, crawler rules, AI summaries, factual schema and lightweight raster preview.');
