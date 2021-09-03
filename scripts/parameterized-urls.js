const fs = require('fs');
fs.writeFileSync('dist/parametrized-urls.csv', '');

let paths = '';

for (i = 0; i < 210000; i++) {
  paths = paths === '' ? `/home?userId=${i}\n` : `${paths}/home?userId=${i}\n`;
}

fs.appendFileSync('dist/parametrized-urls.csv', paths);
