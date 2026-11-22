import { mkdir, cp, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildStaticSite } from './static-site.mjs';
const target = resolve('dist', 'beget-' + new Date().toISOString().replace(/[:.]/g, '-'));
await mkdir(target, { recursive: true });
await buildStaticSite({output:resolve(target,'public_html')});
await copyFile(resolve('telegram.example.php'), resolve(target, 'telegram.example.php'));
await copyFile(resolve('BEGET.md'), resolve(target, 'BEGET.md'));
console.log(target);
