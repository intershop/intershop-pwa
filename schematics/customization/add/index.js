const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execFileSync, execSync } = require('child_process');
const { getMainProject, getThemeNames } = require('intershop-builders/dist/theme-configuration.js');

const prettier = require.resolve('prettier/bin/prettier.cjs');

function format(file) {
  execFileSync(process.execPath, [prettier, '--write', file], { stdio: 'inherit' });
}

const theme = process.argv.slice(2).filter(a => !a.startsWith('-'))?.[0];
const setDefault = process.argv.slice(2).includes('--default');

if (!theme) {
  console.warn('required theme argument missing');
  process.exit(1);
}

// replace in angular.json
const angularJson = parse(fs.readFileSync('./angular.json', { encoding: 'UTF-8' }));
const project = getMainProject(angularJson);
const architect = angularJson.projects[project].architect;
const themeDirectory = `src/styles/themes/${theme}`;
const themeImageDirectory = `src/assets/themes/${theme}/img`;
const existingThemeConfiguration = architect.build.configurations[theme];
const existingThemeKeys = Object.keys(existingThemeConfiguration ?? {});

if (existingThemeConfiguration && existingThemeKeys.length > 0 && existingThemeConfiguration.theme !== theme) {
  console.error(`configuration with name "${theme}" already exists and is not a theme`);
  process.exit(1);
}

if (fs.existsSync(`${themeDirectory}/style.scss`)) {
  console.log(`resuming setup for theme "${theme}"`);
} else {
  // add style definition files
  fs.cpSync('src/styles/themes/b2b', themeDirectory, { recursive: true, errorOnExist: true });
}

const favicon = `${themeImageDirectory}/favicon.ico`;
if (!fs.existsSync(favicon)) {
  fs.mkdirSync(themeImageDirectory, { recursive: true });
  fs.copyFileSync('src/assets/themes/b2b/img/favicon.ico', favicon);
}

console.log('setting prefix for new components to "custom" for all projects');
for (const project in angularJson.projects) {
  angularJson.projects[project].prefix = 'custom';
}

architect.build.configurations[theme] = { ...existingThemeConfiguration, theme };
architect.serve.configurations[theme] = {
  buildTarget: `${project}:build:${theme},development`,
};

if (setDefault) {
  console.log('setting', theme, 'as default for targets');
  architect.build.defaultConfiguration = `${theme},production`;
  architect.serve.defaultConfiguration = theme;
  architect.serve.options.buildTarget = `${project}:build:${theme},development`;
}

fs.writeFileSync('./angular.json', stringify(angularJson, null, 2));
format('angular.json');

// replace in package.json
const packageJson = parse(fs.readFileSync('./package.json', { encoding: 'UTF-8' }));
if (setDefault) {
  packageJson.config['active-themes'] = theme;
} else {
  packageJson.config['active-themes'] = [
    ...new Set(
      `${packageJson.config['active-themes'] ?? ''},${theme}`
        .split(',')
        .map(activeTheme => activeTheme.trim())
        .filter(Boolean)
    ),
  ].join(',');
}
fs.writeFileSync('./package.json', stringify(packageJson, null, 2));
format('package.json');

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

fs.writeFileSync('./eslint.config.mjs', eslintConfig);
format('eslint.config.mjs');

// add environment copy
if (!fs.existsSync(`src/environments/environment.${theme}.ts`)) {
  fs.copyFileSync('src/environments/environment.b2b.ts', `src/environments/environment.${theme}.ts`);
}

// keep the override schematic prompt in sync with the registered themes
const overrideSchemaPath = './schematics/src/helpers/override/schema.json';
const builtOverrideSchemaPath = './schematics/dist/helpers/override/schema.json';
const overrideSchema = parse(fs.readFileSync(overrideSchemaPath, { encoding: 'UTF-8' }));
const themeChoices = [...getThemeNames(angularJson), 'all'];
const choicesChanged =
  JSON.stringify(overrideSchema.properties.theme['x-prompt'].items) !== JSON.stringify(themeChoices);

if (choicesChanged) {
  overrideSchema.properties.theme['x-prompt'].items = themeChoices;
  fs.writeFileSync(overrideSchemaPath, stringify(overrideSchema, null, 2));
  format(overrideSchemaPath);
}

const builtThemeChoices = fs.existsSync(builtOverrideSchemaPath)
  ? parse(fs.readFileSync(builtOverrideSchemaPath, { encoding: 'UTF-8' })).properties.theme['x-prompt'].items
  : [];
if (choicesChanged || JSON.stringify(builtThemeChoices) !== JSON.stringify(themeChoices)) {
  execSync('npm run build:schematics', { stdio: 'inherit' });
}
