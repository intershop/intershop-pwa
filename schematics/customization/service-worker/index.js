const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');
const { Project, ts } = require('ts-morph');

if (process.argv.length < 3) {
  console.warn('required argument missing, provide true or false');
  process.exit(1);
}

const enable = process.argv[2].toLowerCase() === 'true';
console.log('setting serviceWorker to', enable);

// replace in angular.json
const angularJson = parse(fs.readFileSync('./angular.json', { encoding: 'UTF-8' }));
const project = Object.keys(angularJson.projects)[0];
const build = angularJson.projects[project].architect.build;

if (build.options.serviceWorker !== undefined) {
  build.options.serviceWorker = enable;
}

Object.keys(build.configurations).forEach(key => {
  const configuration = build.configurations[key];
  if (configuration.serviceWorker !== undefined) {
    configuration.serviceWorker = enable;
  }
});

fs.writeFileSync('./angular.json', stringify(angularJson, null, 2));
execSync('npx prettier --write angular.json');
