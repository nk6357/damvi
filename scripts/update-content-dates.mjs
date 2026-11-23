// Run explicitly after meaningful content changes; builds never invent fresh dates.
import { readFile, writeFile } from 'node:fs/promises';
import { siteModel } from './site-model.mjs';
import { pageFingerprint } from './search-assets.mjs';
const date = process.argv.find(arg => arg.startsWith('--date='))?.slice(7);
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) throw Error('Pass the actual content date as --date=YYYY-MM-DD');
const model = await siteModel();
const records = await readFile('seo/page-content-dates.json', 'utf8').then(JSON.parse).catch(error => { if (error.code === 'ENOENT') return {}; throw error; });
for (const path of model.routes) {
  const hash = pageFingerprint(path, model);
  if (records[path]?.hash !== hash) records[path] = { date, hash };
}
await writeFile('seo/page-content-dates.json', JSON.stringify(records, null, 2) + '\n');
console.log('Recorded meaningful content dates for', model.routes.length, 'routes.');
