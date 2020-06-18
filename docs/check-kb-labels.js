const fs = require('fs');
const path = require('path');

let files = process.argv.splice(2);

if (files.length === 0) {
  const glob = require('glob');
  files = glob.sync('docs/**/*.md');
}

// ignore documentation overview
files = files.filter(p => !p.endsWith(path.join('docs', 'README.md')));

let isError = false;

function getDefaultLabel(file) {
  const parsedPath = path.parse(file);
  if (parsedPath.dir.endsWith(path.join('docs', 'concepts'))) {
    return `<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

`;
  } else if (parsedPath.dir.endsWith(path.join('docs', 'guides'))) {
    return `<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

`;
  }
}

files.forEach(file => {
  console.log('at', file);
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' });
  if (!fileContent.startsWith('<!--')) {
    let label = getDefaultLabel(file);

    if (label) {
      fs.writeFileSync(file, label + fileContent);
    } else {
      console.warn('kb sync labels missing in', file);
      isError = true;
    }
  } else {
    let label = getDefaultLabel(file);
    if (label && !fileContent.startsWith(label)) {
      console.warn('kb sync labels are not the default ones in', file, '-- remove them and re-run');
      console.warn();
      isError = true;
    }
  }
});

if (isError) process.exit(1);
