const { exec } = require('child_process');
const MD5 = require('md5.js');
const fs = require('fs');

exec('npx tslint -p tsconfig.json --format json', (err, stdout, stderr) => {
  if (err) {
    console.log(err, stderr);
    process.exit(1);
  }

  const errors = JSON.parse(stdout);

  const mapped = errors.map(error => ({
    description: error.ruleName + ': ' + error.failure,
    fingerprint: new MD5().update(JSON.stringify(error)).digest('hex'),
    location: {
      path: error.name.replace(process.cwd() + '/', ''),
      lines: {
        begin: error.startPosition.line,
      },
    },
  }));

  mapped.forEach(error => {
    console.log(error.location.path, error.location.lines.begin, '\n', error.description, '\n');
  });

  fs.writeFile('gl-code-quality-report.json', JSON.stringify(mapped), function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
});
