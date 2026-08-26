import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Regenerates the committed vendor/ajv.mjs bundle. This is a one-off maintenance helper,
// not part of the normal build: the bundle is checked in. Run it only to bump Ajv, from the
// ucp/ directory (so the deps land in ucp, not the repo root):
//   cd ucp && npm i -D esbuild ajv ajv-formats && node playground/build-bundle.mjs
const dir = path.dirname(fileURLToPath(import.meta.url));

// MIT attribution kept in the committed bundle to satisfy ajv's and ajv-formats' license terms.
const banner = `/*!
 * Bundled third-party libraries (MIT):
 *   ajv         - Copyright (c) 2015-2021 Evgeny Poberezkin - https://github.com/ajv-validator/ajv
 *   ajv-formats - Copyright (c) 2020 Evgeny Poberezkin - https://github.com/ajv-validator/ajv-formats
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */`;

await build({
  entryPoints: [path.join(dir, 'ajv-entry.mjs')],
  outfile: path.join(dir, 'vendor', 'ajv.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  legalComments: 'eof',
  banner: { js: banner },
});

console.log('Wrote playground/vendor/ajv.mjs');
