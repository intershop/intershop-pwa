const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');

if (process.argv.length < 3) {
  console.warn('required theme argument missing');
  process.exit(1);
}

const theme = process.argv[2];

// replace in angular.json
const angularJson = parse(fs.readFileSync('./angular.json', { encoding: 'UTF-8' }));
const project = angularJson.defaultProject;
console.log('setting prefix for new components to "custom"');
angularJson.projects[project].prefix = 'custom';

// add style definition files
if (!fs.existsSync(`src/styles/themes/${theme}`)) {
  execSync(`npx ncp src/styles/themes/default src/styles/themes/${theme} --stopOnErr`);
}

angularJson.projects[project].architect.build.configurations[theme] = {};
angularJson.projects[project].architect.serve.configurations[theme] = {
  browserTarget: 'intershop-pwa:build:' + theme,
};
angularJson.projects[project].architect.server.configurations[theme] = {};
angularJson.projects[project].architect['serve-ssr'].configurations[theme] = {
  browserTarget: `intershop-pwa:build:${theme},local`,
  serverTarget: `intershop-pwa:server:${theme},local`,
};

fs.writeFileSync('./angular.json', stringify(angularJson, null, 2));
execSync('npx prettier --write angular.json');

// replace in tslint.json
// "directive-selector": [true, "attribute", "ish", "camelCase"],
// "component-selector": [true, "element", "ish", "kebab-case"],

const addPrefix = target => {
  if (typeof target[2] === 'string') {
    target[2] = ['ish'];
  }
  target[2].push('custom');
  target[2] = target[2].filter((val, idx, arr) => arr.indexOf(val) === idx);
};

const tslintJson = parse(fs.readFileSync('./tslint.json', { encoding: 'UTF-8' }));
addPrefix(tslintJson.rules['directive-selector']);
addPrefix(tslintJson.rules['component-selector']);
fs.writeFileSync('./tslint.json', stringify(tslintJson, null, 2));
execSync('npx prettier --write tslint.json');

// add environment copy
if (!fs.existsSync(`src/environments/environment.${theme}.ts`)) {
  execSync(`npx ncp src/environments/environment.default.ts src/environments/environment.${theme}.ts --stopOnErr`);
}
