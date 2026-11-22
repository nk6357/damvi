import { buildStaticSite } from './static-site.mjs';
const local = process.argv.includes('--local');
await buildStaticSite({output: local ? 'dist/local' : 'dist/beget/public_html', preview:local});
