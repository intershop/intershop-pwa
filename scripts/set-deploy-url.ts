/* eslint-disable ish-custom-rules/ordered-imports, no-console */
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { setDeployUrlInFile } from '../src/ssr/deploy-url';

if (process.argv.length < 3) {
  console.error('required argument deployUrl missing');
  process.exit(1);
}

let deployUrl = process.argv[2];

if (!deployUrl.endsWith('/')) {
  deployUrl += '/';
}

glob.sync('dist/browser/*.{js,css,html}').forEach(file => {
  console.log(`setting deployUrl "${deployUrl}" in`, file);

  const input = fs.readFileSync(file, { encoding: 'utf-8' });

  const output = setDeployUrlInFile(deployUrl, path.basename(file), input);

  fs.writeFileSync(file, output);
});
