import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
for (const root of ['dist/beget/public_html','dist/local','dist/pages']) {
  const html=await readFile(root+'/index.html','utf8');
  const entry=html.match(/<script type="module" src="[^"]*\/app\.js\?v=([a-f0-9]{12})"/);
  assert.ok(entry,root+': missing versioned entry');
  assert.ok(html.includes('app.js?v='+entry[1]+'" />'),root+': preload must match executable');
  for (const file of ['app.js','seo.js','search-content.js','service-search-content.js','other-services.js','legal-documents.js']) {
    const js=await readFile(root+'/'+file,'utf8');
    for (const match of js.matchAll(/['"]\.\/([a-z-]+\.js)([^'"]*)['"]/g)) {
      assert.equal(match[2],'?v='+entry[1],root+'/'+file+': stale dependency '+match[1]);
    }
  }
  const js=await readFile(root+'/app.js','utf8');
  assert.ok(js.includes("import('./other-services.js?v="+entry[1]+"')"),root+': dynamic service import not versioned');
  assert.ok(js.includes("import('./legal-documents.js?v="+entry[1]+"')"),root+': dynamic legal import not versioned');
}
console.log('Release module graph passed: entry, preload, static and dynamic imports share a release version.');
