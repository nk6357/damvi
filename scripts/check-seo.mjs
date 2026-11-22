import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { siteModel } from './site-model.mjs';
import { getPageSeo } from '../public/seo.js';

const model = await siteModel();
const root = 'dist/beget/public_html';
const titles = new Set(), descriptions = new Set();
const sitemap = await readFile(join(root,'sitemap.xml'),'utf8');
for (const path of model.routes) {
  const html = await readFile(join(root,path === '/' ? 'index.html' : '_pages' + path + '.html'),'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/s)?.[1];
  assert.ok(title && description, path + ': missing metadata');
  assert.ok(!titles.has(title), path + ': duplicate title');
  assert.ok(!descriptions.has(description), path + ': duplicate description');
  titles.add(title); descriptions.add(description);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,path + ': single H1');
  assert.ok(html.includes('data-rendered-path="'+path+'"'),path+': prerender missing');
  const schema = JSON.parse(html.match(/id="site-structured-data" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.ok(schema['@graph'].some(n=>n['@type']==='WebSite'));
  if (model.services.some(s=>path === '/services/'+s.slug)) {
    assert.ok(schema['@graph'].some(n=>n['@type']==='Service'),path+': missing Service');
    assert.equal((html.match(/<details class="service-faq-item">/g)||[]).length,4,path+': missing visible FAQ');
    assert.ok(html.includes('class="related-services"'),path+': missing related links');
  }
  const seo = getPageSeo(path,model.services,model.goals);
  assert.ok(html.includes('href="'+seo.canonical+'"'),path+': canonical');
  assert.equal(sitemap.includes('<loc>'+seo.canonical+'</loc>'),!seo.noindex,path+': sitemap inclusion');
  for (const match of html.matchAll(/\b(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
    const url = new URL(match[1], 'https://damvi.ru');
    if (url.pathname.includes('.')) await access(join(root,url.pathname));
    else assert.ok(model.routes.includes(url.pathname) || model.aliases[url.pathname], path + ': broken link '+url.pathname);
  }
}
const errorHtml = await readFile(join(root,'404.html'),'utf8');
assert.ok(errorHtml.includes('noindex, follow'));
assert.equal(getPageSeo('/services/support',model.services,model.goals).canonical,'https://damvi.ru/services/seo-blog');
assert.ok(!sitemap.includes('/services/support'));
const preview = await readFile('dist/pages/services/websites/index.html','utf8');
assert.ok(preview.includes('noindex, follow'));
assert.ok(preview.includes('href="/damvi/styles.css?'));
assert.ok(preview.includes('href="https://damvi.ru/services/websites"'));
await access('dist/pages/seo.js');
console.log(`SEO checks passed: ${model.routes.length} pages, ${model.services.length} services, unique metadata, H1, schema, canonical, sitemap, local links and Pages base path.`);
