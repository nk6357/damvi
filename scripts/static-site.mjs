import { mkdir, cp, readFile, writeFile, rm, lstat, readdir } from 'node:fs/promises';
import { join, dirname, resolve, sep, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { siteModel } from './site-model.mjs';
import { getPageSeo, SITE_ORIGIN } from '../public/seo.js';
import { robotsText, llmDocuments, pageFingerprint } from './search-assets.mjs';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function copyPublicFile(source, destination) {
  const entry = await lstat(source);
  if (!entry.isFile() || entry.isSymbolicLink()) throw new Error('Unexpected symlink/non-file public resource');
  await cp(source, destination);
}
async function copyAssets(source, destination) {
  await mkdir(destination, {recursive:true});
  for (const entry of await readdir(source, {withFileTypes:true})) {
    if (entry.isSymbolicLink() || entry.name.startsWith('.')) throw new Error('Unexpected hidden/symlink asset');
    const from = join(source, entry.name), to = join(destination, entry.name);
    if (entry.isDirectory()) await copyAssets(from, to);
    else {
      if (!entry.isFile() || !/\.(?:svg|png|jpe?g|webp|avif|gif|ico|woff2?)$/i.test(extname(entry.name)) && !/LICENSE\.txt$/i.test(entry.name)) throw new Error('Unexpected asset type: ' + entry.name);
      await cp(from, to);
    }
  }
}
export async function buildStaticSite({output, base = '', preview = false, layout = 'beget'}) {
  if (!/^(?:\/[a-zA-Z0-9._-]+)*$/.test(base)) throw new Error('Invalid base path');
  const target = resolve(output), dist = resolve('dist');
  if (!target.startsWith(dist + sep)) throw new Error('Build output must be inside dist/');
  const outputParents = [dist];
  for (let path = target; path !== dist; path = dirname(path)) outputParents.push(path);
  for (const path of outputParents) {
    const entry = await lstat(path).catch(error => { if (error.code !== 'ENOENT') throw error; });
    if (entry?.isSymbolicLink()) throw new Error('Refusing symlink build output');
  }
  const model = await siteModel();
  const template = await readFile('public/index.html', 'utf8');
  const rules = await readFile('public/.htaccess', 'utf8');
  const policy = rules.match(/^Header always set Content-Security-Policy "([^"]+)"$/m)?.[1];
  if (!policy) throw new Error('Missing content security policy');
  // frame-ancestors is an HTTP-only directive; Pages cannot set custom headers.
  const metaPolicy = policy.replace(/; frame-ancestors [^;]+/, '');
  const css = await readFile('public/styles.css');
  const cssVersion = createHash('sha256').update(css).digest('hex').slice(0,12);
  const withBase = html => base ? html.replace(/(\b(?:href|src)=")\/(?!\/)/g, '$1' + base + '/') : html;
  // Fresh releases cannot retain an accidentally copied secret, backup or old API.
  await rm(target, {recursive:true, force:true});
  await mkdir(output, {recursive:true});
  // Explicit allowlist: never include private settings or internal legal drafts.
  const moduleFiles = ['app.js','seo.js','search-content.js','service-search-content.js','other-services.js','legal-documents.js'];
  const moduleSources = await Promise.all(moduleFiles.map(async file => {
    const source = join('public', file);
    const entry = await lstat(source);
    if (!entry.isFile() || entry.isSymbolicLink()) throw new Error('Unexpected symlink/non-file public resource');
    return readFile(source, 'utf8');
  }));
  const moduleVersion = createHash('sha256').update(moduleSources.join('\n')).digest('hex').slice(0, 12);
  // Version the entire module graph, including dynamic imports, as one release.
  // Otherwise a cached dependency can restore old copy/metadata after navigation.
  for (const [index, file] of moduleFiles.entries()) {
    const source = moduleSources[index].replace(/(['"])\.\/([a-z-]+\.js)\1/g, (match, quote, dependency) => moduleFiles.includes(dependency) ? `${quote}./${dependency}?v=${moduleVersion}${quote}` : match);
    await writeFile(join(output, file), source);
  }
  await copyPublicFile('public/styles.css', join(output, 'styles.css'));
  await copyAssets('public/assets', join(output, 'assets'));
  // Approved ownership proofs belong only on the canonical production host.
  if (!preview) {
    for (const file of ['yandex_0af32123aa1d73be.html', 'googlef0cd9bf0538e0e60.html', 'BingSiteAuth.xml']) {
      await copyPublicFile(join('public', file), join(output, file));
    }
  }
  if (layout === 'beget') {
    await copyPublicFile('public/.htaccess', join(output, '.htaccess'));
    await mkdir(join(output, 'api'), {recursive:true});
    for (const file of ['contact.php', 'contact-lib.php']) await copyPublicFile(join('public/api', file), join(output, 'api', file));
  }
  function htmlFor(path) {
    const seo = getPageSeo(path, model.services, model.goals, {indexable:!preview});
    const html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(seo.title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(seo.description)}" />`)
      .replace('<div id="app"></div>', `<div id="app">${model.siteNav()}<main id="page-content" data-rendered-path="${escape(path)}">${model.content(path)}</main></div>`)
      .replace('</head>', `<meta http-equiv="Content-Security-Policy" content="${escape(metaPolicy)}" />
    <link rel="canonical" href="${escape(seo.canonical)}" />
    <meta name="robots" content="${seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />
    <meta property="og:title" content="${escape(seo.title)}" />
    <meta property="og:description" content="${escape(seo.description)}" />
    <meta property="og:url" content="${escape(seo.canonical)}" />
    <meta property="og:site_name" content="Damvi" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:image" content="${escape(seo.image)}" />
    <meta property="og:image:secure_url" content="${escape(seo.image)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Damvi — цифровые решения для бизнеса" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(seo.title)}" />
    <meta name="twitter:description" content="${escape(seo.description)}" />
    <meta name="twitter:image" content="${escape(seo.image)}" />
    <meta name="twitter:image:alt" content="Damvi — цифровые решения для бизнеса" />
    <script id="site-structured-data" type="application/ld+json">${JSON.stringify(seo.jsonLd).replace(/</g,'\\u003c')}</script>
    ${layout === 'pages' ? `<meta name="damvi-pages-base" content="${escape(base)}" />` : ''}</head>`)
      .replace('/styles.css"', '/styles.css?v=' + cssVersion + '"')
      .replace(/\/app\.js"/g, '/app.js?v=' + moduleVersion + '"');
    return withBase(html);
  }
  for (const path of model.routes) {
    const filename = path === '/' ? 'index.html' : layout === 'pages' ? join(path.slice(1),'index.html') : join('_pages',path.slice(1)+'.html');
    await mkdir(dirname(join(output,filename)), {recursive:true});
    await writeFile(join(output,filename),htmlFor(path));
  }
  await writeFile(join(output,'404.html'),htmlFor('/404'));
  if (layout === 'pages') {
    for (const [alias, canonical] of Object.entries(model.aliases)) {
      await mkdir(join(output,alias.slice(1)),{recursive:true});
      await writeFile(join(output,alias.slice(1),'index.html'),htmlFor(canonical));
    }
    await writeFile(join(output,'.nojekyll'),'');
  }
  const indexable = model.routes.filter(path=>!getPageSeo(path,model.services,model.goals).noindex);
  const urls = preview ? [] : indexable;
  const dates = await readFile('seo/page-content-dates.json', 'utf8').then(JSON.parse).catch(error => { if (error.code === 'ENOENT') return {}; throw error; });
  await writeFile(join(output,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(path => {
    const record = dates[path];
    const lastmod = record?.hash === pageFingerprint(path, model) && /^\d{4}-\d{2}-\d{2}$/.test(record.date) ? `<lastmod>${record.date}</lastmod>` : '';
    const priority = path === '/' ? '1.0' : ['/privacy','/consent','/legal'].includes(path) ? '0.2' : path === '/projects' ? '0.7' : '0.8';
    return `  <url><loc>${escape(SITE_ORIGIN+(path==='/'?'/':path))}</loc>${lastmod}<priority>${priority}</priority></url>`;
  }).join('\n')+'\n</urlset>\n');
  await writeFile(join(output,'robots.txt'), robotsText(preview));
  if (!preview) {
    const documents = llmDocuments(model);
    await writeFile(join(output, 'llms.txt'), documents.short);
    await writeFile(join(output, 'llms-full.txt'), documents.full);
  }
  await writeFile(join(output,'route-map.json'),JSON.stringify({routes:model.routes,aliases:model.aliases}));
  console.log(`Built ${model.routes.length} HTML pages: ${output}${preview?' (noindex preview)':''}`);
  return model;
}
