const { readFileSync } = require('fs');
const glob = require('glob');
const { execSync } = require('child_process');

glob('src/app/extensions/**/shared/**/*.component.ts', (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach(file => {
    if (/@GenerateLazyComponent\(\)/.test(readFileSync(file, { encoding: 'utf-8' }))) {
      execSync('npm run --silent ng -- g lazy-component --ci ' + file, { stdio: 'inherit' });
    }
  });

  const userName = require('os').userInfo().username;
  // skip linting for root user (docker build)
  if (userName !== 'root') {
    execSync("npm run --silent lint -- --fix --files 'src/app/extensions/**/exports/**/*.ts'", { stdio: 'ignore' });
  }
});
