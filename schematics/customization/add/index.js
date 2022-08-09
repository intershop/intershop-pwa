const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');

const theme = process.argv.slice(2).filter(a => !a.startsWith('-'))?.[0];
const setDefault = process.argv.slice(2).includes('--default');

if (!theme) {
  console.warn('required theme argument missing');
  process.exit(1);
}

if (fs.existsSync(`src/styles/themes/${theme}/style.scss`)) {
  console.error(`theme with name "${theme}" already exists`);
  process.exit(1);
}

// add style definition files
execSync(`npx ncp src/styles/themes/b2b src/styles/themes/${theme} --stopOnErr`);

// replace in angular.json
const angularJson = parse(fs.readFileSync('./angular.json', { encoding: 'UTF-8' }));
const project = angularJson.defaultProject;
console.log('setting prefix for new components to "custom" for all projects');
for (const project in angularJson.projects) {
  angularJson.projects[project].prefix = 'custom';
}

const architect = angularJson.projects[project].architect;
architect.build.configurations[theme] = {};
architect.serve.configurations[theme] = {
  browserTarget: 'intershop-pwa:build:' + theme,
};
architect.server.configurations[theme] = {};
architect['serve-ssr'].configurations[theme] = {
  browserTarget: `intershop-pwa:build:${theme},development`,
  serverTarget: `intershop-pwa:server:${theme},development`,
};

if (setDefault) {
  console.log('setting', theme, 'as default for targets');
  architect.build.defaultConfiguration = theme + ',production';
  architect.serve.defaultConfiguration = theme + ',development';
  architect.server.defaultConfiguration = theme + ',production';
  architect['serve-ssr'].defaultConfiguration = theme;
}

fs.writeFileSync('./angular.json', stringify(angularJson, null, 2));
execSync('npx prettier --write angular.json');

// replace in package.json
const packageJson = parse(fs.readFileSync('./package.json', { encoding: 'UTF-8' }));
if (setDefault) {
  packageJson.config['active-themes'] = theme;
} else {
  packageJson.config['active-themes'] = `${packageJson.config['active-themes']},${theme}`;
}
fs.writeFileSync('./package.json', stringify(packageJson, null, 2));
execSync('npx prettier --write package.json');

// replace in .eslintrc.json
const addPrefixToRule = ruleConfig => {
  if (typeof ruleConfig.prefix === 'string') {
    ruleConfig.prefix = ['ish'];
  }
  ruleConfig.prefix.push('custom');
  ruleConfig.prefix = ruleConfig.prefix.filter((val, idx, arr) => arr.indexOf(val) === idx);
};

const eslintJson = parse(fs.readFileSync('./.eslintrc.json', { encoding: 'UTF-8' }));
const overrideRules = eslintJson.overrides.find(c => c.files.includes('*.ts')).rules;
addPrefixToRule(overrideRules['@angular-eslint/directive-selector'][1]);
addPrefixToRule(overrideRules['@angular-eslint/component-selector'][1]);

const reusePatterns = overrideRules['ish-custom-rules/project-structure'][1].reusePatterns;
reusePatterns.theme = reusePatterns.theme.replace('b2b|b2c', `b2b|b2c|${theme}`);

fs.writeFileSync('./.eslintrc.json', stringify(eslintJson, null, 2));
execSync('npx prettier --write .eslintrc.json');

// add environment copy
if (!fs.existsSync(`src/environments/environment.${theme}.ts`)) {
  execSync(`npx ncp src/environments/environment.b2b.ts src/environments/environment.${theme}.ts --stopOnErr`);
}

// add theme to schematics
const overrideSchematic = './schematics/src/helpers/override/schema.json';
const schematicsJson = parse(fs.readFileSync(overrideSchematic, { encoding: 'UTF-8' }));

if (!schematicsJson.properties.theme.enum.includes(theme)) {
  schematicsJson.properties.theme.enum.unshift(theme);
  fs.writeFileSync(overrideSchematic, stringify(schematicsJson, null, 2));
  execSync('npx prettier --write ' + overrideSchematic);
  execSync('npm run build:schematics');
}
