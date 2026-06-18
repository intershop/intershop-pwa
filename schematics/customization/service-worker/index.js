const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');

if (process.argv.length < 3) {
  console.warn('required argument missing, provide true or false');
  process.exit(1);
}

const enable = process.argv[2].toLowerCase() === 'true';
console.log('setting serviceWorker to', enable);

// replace in angular.json
const angularJson = parse(fs.readFileSync('./angular.json', { encoding: 'UTF-8' }));
const project = Object.keys(angularJson.projects)[0];
const architect = angularJson.projects[project].architect;

function setServiceWorker(target, value = enable) {
  if (!target) {
    return;
  }

  if (target.options?.serviceWorker !== undefined) {
    target.options.serviceWorker = value;
  }

  Object.values(target.configurations || {}).forEach(configuration => {
    if (configuration.serviceWorker !== undefined) {
      configuration.serviceWorker = value;
    }
  });
}

setServiceWorker(architect.build);
setServiceWorker(architect['build-application-spike'], enable ? 'ngsw-config.json' : false);

fs.writeFileSync('./angular.json', stringify(angularJson, null, 2));
execSync('npx prettier --write angular.json');
