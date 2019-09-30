const { exec } = require('child_process');
const MD5 = require('md5.js');
const fs = require('fs');

exec('npx tslint -p tsconfig.json --format json', (err1, stdout, stderr) => {
  const errors = JSON.parse(stdout);

  const mapped = errors
    .map(error => {
      console.log(
        error.ruleSeverity,
        error.name.replace(process.cwd() + '/', '') + ':' + (error.startPosition.line + 1),
        error.failure
      );
      return error;
    })
    .map(error => ({
      description: error.ruleName + ': ' + error.failure,
      fingerprint: new MD5().update(JSON.stringify(error)).digest('hex'),
      location: {
        path: error.name.replace(process.cwd() + '/', ''),
        lines: {
          begin: error.startPosition.line + 1,
        },
      },
    }));

  fs.writeFile('gl-code-quality-report.json', JSON.stringify(mapped), function(err2) {
    if (err1 || err2) {
      process.exit(1);
    }
  });
});
