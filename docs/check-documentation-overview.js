const fs = require('fs');
const path = require('path');
const glob = require('glob');

const overviewContent = fs.readFileSync('docs/README.md', { encoding: 'utf-8' });
const match = overviewContent.match(/\[.*?\](\(|:\s+)[^\s]*\)?/g);
const links = [];

if (match) {
  match.forEach(link => {
    const linkTo = /\](\(<?|:\s+)(.*?)(>?\)|$|#)/.exec(link)[2];

    if (linkTo) {
      // link is not document-internal
      if (!linkTo.startsWith('http')) {
        const basename = path.normalize(path.join(process.cwd(), 'docs', linkTo));
        links.push(basename);
      }
    }
  });
}

const files = glob.sync('docs/*/*.md');
let isError = false;

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  // console.log('######');
  // console.log(files);
  // console.log(fullPath);
  if (!links.includes(fullPath)) {
    console.warn('document not linked in overview docs/README.md: .' + file.substr(4));
    isError = true;
  }
});

if (isError) {
  process.exit(1);
}
