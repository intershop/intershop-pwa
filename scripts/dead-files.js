const { globSync } = require('glob');

const { loadSourceMapFiles } = require('./active-localization-files');
const { readAngularWorkspace, resolveActiveThemes } = require('intershop-builders/dist/theme-configuration.js');

const packageJson = require('../package.json');
const workspace = readAngularWorkspace(process.cwd());
const activeThemes = resolveActiveThemes(
  workspace,
  process.env.ACTIVE_THEMES || process.env.npm_config_active_themes || packageJson.config?.['active-themes']
);

const activeFiles = new Set(activeThemes.flatMap(theme => loadSourceMapFiles(`dist/${theme}`, theme)));
const filesToBeSearched = globSync('{src,projects}/**/!(*.spec).{ts,html,scss}');

filesToBeSearched
  .filter(file => !activeFiles.has(file.replace(/\\/g, '/')))
  .filter(file => !file.includes('/dev/') && !file.endsWith('.model.ts') && !file.endsWith('.interface.ts'))
  .forEach(file => console.log(file));
