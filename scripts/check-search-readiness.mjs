import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, stat, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { siteModel } from './site-model.mjs';
import { getPageSeo, SITE_ORIGIN } from '../public/seo.js';

// Offline inspection of built HTML, not a claim about live indexing or rankings.
const model = await siteModel();
const hash = value => createHash('sha256').update(value).digest('hex');
const read = path => readFile(path, 'utf8');
const environments = [
  { name: 'production', root: 'dist/beget/public_html', preview: false },
  { name: 'local', root: 'dist/local', preview: true },
  { name: 'pages', root: 'dist/pages', preview: true }
];
const htmlFile = (env, route) => route === '/404' ? '404.html' : route === '/' ? 'index.html' : env.name === 'pages' ? route.slice(1) + '/index.html' : '_pages' + route + '.html';
const sourceText = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const snapshot = { environments: {}, redirects: await read('public/.htaccess'), resources: {} };

for (const env of environments) {
  const sitemap = await read(join(env.root, 'sitemap.xml'));
  const robots = await read(join(env.root, 'robots.txt'));
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const routes = {};
  assert.match(robots, /User-agent: \*\nAllow: \//);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Disallow: \/_pages\//);
  if (env.preview) assert.equal(sitemapUrls.length, 0, env.name + ': preview sitemap must be empty');
  else assert.ok(robots.includes('Sitemap: ' + SITE_ORIGIN + '/sitemap.xml'));

  for (const route of [...model.routes, '/404']) {
    const html = await read(join(env.root, htmlFile(env, route)));
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(main, env.name + route + ': missing rendered content');
    const meta = (key, property = false) => html.match(new RegExp(`<meta ${property ? 'property' : 'name'}="${key}" content="([^"]*)"`))?.[1];
    const structured = JSON.parse(html.match(/id="site-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const h1 = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => sourceText(m[1]));
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const expected = getPageSeo(route, model.services, model.goals, { indexable: !env.preview });
    if (env.preview || ['/privacy', '/consent', '/404'].includes(route)) assert.match(meta('robots'), /\bnoindex\b/, env.name + route + ': required noindex lost');
    else assert.ok(!meta('robots').includes('noindex'), env.name + route + ': commercial page accidentally blocked');
    assert.equal(canonical, expected.canonical, env.name + route + ': canonical');
    assert.equal(h1.length, 1, env.name + route + ': H1');
    assert.equal(meta('robots').includes('noindex'), expected.noindex, env.name + route + ': indexability');
    assert.equal(sitemapUrls.includes(canonical), route !== '/404' && !expected.noindex, env.name + route + ': sitemap');
    assert.ok(sourceText(main).length > 100, env.name + route + ': empty HTML');
    const ids = structured['@graph'].map(n => n['@id']).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, env.name + route + ': duplicate entity IDs');
    for (const node of structured['@graph']) {
      assert.ok(!['FAQPage', 'AggregateRating', 'Review'].includes(node['@type']), route + ': unexpected new schema type');
      if (node['@type'] === 'Service') {
        const service = model.services.find(s => canonical.endsWith('/services/' + s.slug));
        assert.ok(service && sourceText(main).includes(service.name), route + ': service not represented in HTML');
        assert.equal((main.match(/class="service-faq-item"/g) || []).length, 4, route + ': missing HTML answers');
        assert.equal(node.brand['@id'], SITE_ORIGIN + '/#brand', route + ': inconsistent brand');
        assert.equal(node.mainEntityOfPage['@id'], canonical + '#page', route + ': missing service/page link');
      }
      if (node.breadcrumb) assert.ok(ids.includes(node.breadcrumb['@id']), route + ': unresolved breadcrumb');
      if (node.mainEntity) assert.ok(ids.includes(node.mainEntity['@id']), route + ': unresolved mainEntity');
    }
    const base = html.match(/name="damvi-pages-base" content="([^"]*)"/)?.[1] || '';
    const internalLinks = [...html.matchAll(/\bhref="(\/(?!\/)[^"]*)"/g)].map(m => {
      const url = new URL(m[1], SITE_ORIGIN);
      if (base && (url.pathname === base || url.pathname.startsWith(base + '/'))) url.pathname = url.pathname.slice(base.length) || '/';
      return url.pathname + url.search + url.hash;
    });
    for (const href of internalLinks) {
      const url = new URL(href, SITE_ORIGIN);
      const path = url.pathname.replace(/\/$/, '') || '/';
      if (model.routes.includes(path) || model.aliases[path]) {
        if (url.hash) {
          const target = model.aliases[path] || path;
          const targetHtml = await read(join(env.root, htmlFile(env, target)));
          assert.ok(targetHtml.includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), route + ': missing anchor ' + href);
        }
      } else assert.ok(url.pathname.includes('.') && !url.hash, route + ': unknown linked route ' + href);
    }
    routes[route] = {
      expectedStatus: route === '/404' ? 404 : 200,
      title: html.match(/<title>([\s\S]*?)<\/title>/)[1], description: meta('description'), h1,
      canonical, robots: meta('robots'),
      openGraph: Object.fromEntries(['title', 'description', 'url', 'site_name', 'type', 'locale'].map(key => [key, meta('og:' + key, true)])),
      jsonLd: structured, internalLinks, inSitemap: sitemapUrls.includes(canonical),
      contentTextLength: sourceText(main).length,
      // Includes nav, fields, links and visible markup: catch accidental design/content edits.
      renderedBodyHash: hash(html.slice(html.indexOf('<body>')))
    };
  }
  for (const entry of await readdir(env.root)) {
    assert.ok(!['seo', 'private', '.env', 'node_modules', 'scripts'].includes(entry), env.name + ': internal files in release');
  }
  snapshot.environments[env.name] = { robots, sitemapUrls, aliases: model.aliases, routes };
}
for (const file of ['public/styles.css', 'public/app.js', 'public/seo.js', 'public/service-search-content.js', 'public/legal-documents.js', 'public/other-services.js']) {
  snapshot.resources[file] = { bytes: (await stat(file)).size, sha256: hash(await readFile(file)) };
}

// Existing values must survive; only additive JSON-LD properties are allowed.
function includesExisting(actual, previous, label) {
  if (Array.isArray(previous)) {
    assert.ok(Array.isArray(actual));
    assert.equal(actual.length, previous.length, label + ': array length changed');
    previous.forEach((value, i) => includesExisting(actual[i], value, label + '[' + i + ']'));
  } else if (previous && typeof previous === 'object') {
    for (const [key, value] of Object.entries(previous)) includesExisting(actual?.[key], value, label + '.' + key);
  } else assert.equal(actual, previous, label + ': changed');
}
const args = process.argv.slice(2);
if (args.includes('--compare')) {
  const before = JSON.parse(await read(args[args.indexOf('--compare') + 1]));
  assert.deepEqual(snapshot.redirects, before.redirects, 'Redirect rules changed');
  for (const [envName, previous] of Object.entries(before.environments)) {
    const current = snapshot.environments[envName];
    assert.deepEqual(Object.keys(current.routes), Object.keys(previous.routes), envName + ': routes changed');
    assert.deepEqual(current.robots, previous.robots, envName + ': robots changed');
    assert.deepEqual(current.sitemapUrls, previous.sitemapUrls, envName + ': sitemap changed');
    assert.deepEqual(current.aliases, previous.aliases, envName + ': aliases changed');
    for (const [route, oldPage] of Object.entries(previous.routes)) {
      const { jsonLd, ...oldRest } = oldPage;
      const { jsonLd: newJsonLd, ...newRest } = current.routes[route];
      assert.deepEqual(newRest, oldRest, envName + route + ': existing page SEO or visible content changed');
      includesExisting(newJsonLd, jsonLd, envName + route + '.jsonLd');
    }
  }
  for (const [file, resource] of Object.entries(before.resources)) {
    if (file !== 'public/seo.js') assert.deepEqual(snapshot.resources[file], resource, 'Unrelated resource changed: ' + file);
  }
}
if (args.includes('--output')) {
  const output = args[args.indexOf('--output') + 1];
  assert.match(output || '', /^seo\/geo-aio\/[a-z0-9-]+\.json$/, 'Write audit snapshots only outside public output');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(snapshot, null, 2) + '\n');
}
console.log(`Search readiness passed: ${model.routes.length} pages + 404 across 3 builds; HTML answers, anchors, schemas, sitemap and preview noindex${args.includes('--compare') ? '; baseline preserved' : ''}.`);
