const fs = require('fs');

let files = process.argv.splice(2);

if (files.length === 0) {
  const glob = require('glob');
  files = glob.sync('docs/**/*.md');
}

files.forEach(file => {
  const fileContent = fs.readFileSync(file, { encoding: 'utf-8' });
  const newContent = fileContent
    .split('\n')
    .map(line => {
      if (/^(>|#|\||\s*-|\s*[0-9]+\.)/.test(line)) {
        return line;
      } else {
        return line.replace(/((?<!i\.e|e\.g)\.) ([A-Z0-9])/g, '$1\n$2');
      }
    })
    .join('\n');

  if (newContent !== fileContent) {
    fs.writeFileSync(file, newContent);
  }
});
