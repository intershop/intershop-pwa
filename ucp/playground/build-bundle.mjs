import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Regenerates the committed vendor/ajv.mjs bundle. This is a one-off maintenance helper,
// not part of the normal build: the bundle is checked in. Run it only to bump Ajv, e.g.
//   npm i -D esbuild ajv ajv-formats && node playground/build-bundle.mjs
const dir = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.join(dir, 'ajv-entry.mjs')],
  outfile: path.join(dir, 'vendor', 'ajv.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  legalComments: 'none',
});

console.log('Wrote playground/vendor/ajv.mjs');
