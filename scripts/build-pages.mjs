import { buildStaticSite } from './static-site.mjs';
const base = (process.argv[2] ?? '/damvi').replace(/\/$/, '');
await buildStaticSite({output:'dist/pages',base,layout:'pages',preview:true});
