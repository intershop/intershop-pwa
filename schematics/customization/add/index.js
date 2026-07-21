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
const project = Object.keys(angularJson.projects).find(project => angularJson.projects[project].root === '');
console.log('setting prefix for new components to "custom" for all projects');
for (const project in angularJson.projects) {
  angularJson.projects[project].prefix = 'custom';
}

const architect = angularJson.projects[project].architect;
architect['build-webpack'].configurations[theme] = {};
architect['serve-webpack'].configurations[theme] = {
  buildTarget: 'intershop-pwa:build-webpack:' + theme,
};
architect['server-webpack'].configurations[theme] = {};
architect['serve-ssr-webpack'].configurations[theme] = {
  buildTarget: `intershop-pwa:build-webpack:${theme},development`,
  serverTarget: `intershop-pwa:server-webpack:${theme},development`,
};

if (setDefault) {
  console.log('setting', theme, 'as default for targets');
  architect['build-webpack'].defaultConfiguration = theme + ',production';
  architect['serve-webpack'].defaultConfiguration = theme + ',development';
  architect['server-webpack'].defaultConfiguration = theme + ',production';
  architect['serve-ssr-webpack'].defaultConfiguration = theme;
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

// replace in eslint.config.mjs
let eslintConfig = fs.readFileSync('./eslint.config.mjs', { encoding: 'UTF-8' });

// Add 'custom' prefix to component-selector and directive-selector rules: prefix: ['ish'] -> prefix: ['ish', 'custom']
if (!eslintConfig.includes("prefix: ['ish', 'custom']")) {
  eslintConfig = eslintConfig.replace(/prefix: \['ish'\]/g, "prefix: ['ish', 'custom']");
}

// Add 'custom' prefix to pipe-prefix rule: prefixes: ['ish'] -> prefixes: ['ish', 'custom']
if (!eslintConfig.includes("prefixes: ['ish', 'custom']")) {
  eslintConfig = eslintConfig.replace(/prefixes: \['ish'\]/g, "prefixes: ['ish', 'custom']");
}

// Add theme to project-structure reusePatterns.theme: b2b|b2c -> b2b|b2c|newTheme
if (!eslintConfig.includes(`b2b|b2c|${theme}`)) {
  eslintConfig = eslintConfig.replace(/\(\?:b2b\|b2c\)/g, `(?:b2b|b2c|${theme})`);
}

fs.writeFileSync('./eslint.config.mjs', eslintConfig);
execSync('npx prettier --write eslint.config.mjs');

// add environment copy
if (!fs.existsSync(`src/environments/environment.${theme}.ts`)) {
  execSync(`npx ncp src/environments/environment.b2b.ts src/environments/environment.${theme}.ts --stopOnErr`);
}

// add theme to schematics
const overrideSchematic = './schematics/src/helpers/override/schema.json';
const schematicsJson = parse(fs.readFileSync(overrideSchematic, { encoding: 'UTF-8' }));

if (!schematicsJson.properties.theme.enum.includes(theme)) {
  if (setDefault) {
    schematicsJson.properties.theme.enum = [theme, 'all'];
  } else {
    schematicsJson.properties.theme.enum.unshift(theme);
  }
  fs.writeFileSync(overrideSchematic, stringify(schematicsJson, null, 2));
  execSync('npx prettier --write ' + overrideSchematic);
  execSync('npm run build:schematics');
}
