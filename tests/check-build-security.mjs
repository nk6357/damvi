import assert from 'node:assert/strict';
import {mkdir, writeFile, access, readdir, symlink, rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildStaticSite} from '../scripts/static-site.mjs';

const output = 'dist/security-test';
await mkdir(output + '/api', {recursive:true});
await writeFile(output + '/.env', 'TEST_CANARY');
await writeFile(output + '/api/contact.php.bak', 'TEST_CANARY');
await buildStaticSite({output, preview:true});
await assert.rejects(access(output + '/.env'));
await assert.rejects(access(output + '/api/contact.php.bak'));
assert.deepEqual((await readdir(output + '/api')).sort(), ['contact-lib.php', 'contact.php']);
await assert.rejects(buildStaticSite({output:'public'}), /inside dist/);
const link = 'dist/security-output-link';
await symlink(resolve(output), link);
try {
  await assert.rejects(buildStaticSite({output:link + '/child'}), /symlink/);
  await access(output + '/index.html');
} finally { await rm(link); }
console.log('Build security passed: stale secret/backup removed, API allowlist, outside/symlink output rejected.');
