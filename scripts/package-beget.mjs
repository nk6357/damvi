import { mkdir, cp, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const target = resolve('dist', 'beget-' + new Date().toISOString().replace(/[:.]/g, '-'));
await mkdir(target, { recursive: true });
await cp(resolve('public'), resolve(target, 'public_html'), { recursive: true });
await copyFile(resolve('telegram.example.php'), resolve(target, 'telegram.example.php'));
await copyFile(resolve('BEGET.md'), resolve(target, 'BEGET.md'));
console.log(target);
