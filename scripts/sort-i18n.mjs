import * as fs from 'fs';
import globModule from 'glob';
import sort from 'sort-json';

const { sync } = globModule;

/** @type string[] */
let files;

if (process.argv.length > 2) {
  files = process.argv.slice(2);
} else {
  files = sync('src/assets/i18n/*.json');
}

files.forEach(file => {
  console.log('sorting', file);

  const content = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
  const sorted = sort(content);
  fs.writeFileSync(file, `${JSON.stringify(sorted, undefined, 2)}\n`);
});
