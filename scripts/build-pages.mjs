import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { otherServices } from '../public/other-services.js';

const base = (process.argv[2] ?? '/damvi').replace(/\/$/, '');
if (!/^(?:\/[a-zA-Z0-9._-]+)*$/.test(base)) throw new Error('Invalid Pages base path');

const output = 'dist/pages';
await mkdir(output, { recursive: true });
const [template, app, css] = await Promise.all([
  readFile('public/index.html', 'utf8'),
  readFile('public/app.js', 'utf8'),
  readFile('public/styles.css')
]);
const styleVersion = createHash('sha256').update(css).digest('hex').slice(0, 12);
const html = template.replace(/((?:href|src)=")\/(?!\/)/g, '$1' + base + '/')
  .replace('/styles.css"', '/styles.css?v=' + styleVersion + '"')
  .replace('</head>', '  <meta name="damvi-pages-base" content="' + base + '" />\n  </head>');

const serviceSlugs = [
  ...[...app.matchAll(/\bslug: '([\w-]+)'/g)].map(match => match[1]),
  ...[...app.matchAll(/\baliases: \[([^\]]+)\]/g)].flatMap(match => [...match[1].matchAll(/'([\w-]+)'/g)].map(alias => alias[1])),
  ...otherServices.flatMap(service => [service.slug, ...(service.aliases ?? [])]),
  'other'
];
const goalSlugs = [...app.matchAll(/^  '([\w-]+)': \{$/gm)].map(match => match[1]);
const routes = ['', 'projects', 'privacy', ...serviceSlugs.map(slug => 'services/' + slug),
  ...goalSlugs.map(slug => 'goals/' + slug)];

await Promise.all([
  ...['app.js', 'other-services.js', 'styles.css', 'assets', 'robots.txt']
    .map(file => cp(join('public', file), join(output, file), { recursive: true })),
  writeFile(join(output, '.nojekyll'), ''),
  writeFile(join(output, '404.html'), html),
  ...[...new Set(routes)].map(async route => {
    const directory = join(output, route);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), html);
  })
]);
console.log('Built GitHub Pages site for ' + (base || '/'));
