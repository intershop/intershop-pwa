const synchronizations = {
  'pwa-docker-build': ['Dockerfile', 'Dockerfile_noSSR'],
};

const fs = require('fs');

foundError = false;

Object.keys(synchronizations).forEach(key => {
  const table = synchronizations[key]
    .map(file => process.cwd() + '/' + file)
    .map(path =>
      fs
        .readFileSync(path, 'utf-8')
        .split(/\r?\n/)
        .map(line => line.trim())
    )
    .map(lines => {
      const begin = lines.findIndex(line => line.includes('synchronize-marker:' + key + ':begin')) + 1;
      const end = lines.findIndex(line => line.includes('synchronize-marker:' + key + ':end'));
      return lines.slice(begin, end).reduce((arr, line, idx) => [...arr, { idx: begin + idx, line }], []);
    })
    .reduce((acc, lines, _, allLines) => {
      const noOfLines = allLines.reduce((cur, arr) => Math.max(cur, arr.length), 0);
      for (let index = 0; index < noOfLines; index++) {
        acc[index] = acc[index] || [];
        acc[index].push(index < lines.length ? lines[index] : { idx: acc[index - 1].idx + 1, line: '' });
      }
      return acc;
    }, []);

  for (let row = 0; row < table.length; row++) {
    const first = table[row][0].line;
    const equal = table[row].slice(1).reduce((acc, val) => acc && val.line === first, true);
    if (!equal) {
      console.error('\nline diff:', row);
      synchronizations[key].forEach((file, col) => {
        console.log(file + ':' + (table[row][col].idx + 1), table[row][col].line);
      });
      foundError = true;
    }
  }
});

if (foundError) {
  process.exit(1);
}
