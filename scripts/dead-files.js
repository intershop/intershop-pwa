const { globSync } = require('glob');

const { loadSourceMapFiles } = require('./active-localization-files');

const packageJson = require('../package.json');
const activeThemes = (process.env.npm_config_active_themes || packageJson.config['active-themes'])
  .split(',')
  .map(theme => theme.trim())
  .filter(Boolean);

const activeFiles = new Set(activeThemes.flatMap(theme => loadSourceMapFiles(`dist/${theme}`, theme)));
const filesToBeSearched = globSync('{src,projects}/**/!(*.spec).{ts,html,scss}');

filesToBeSearched
  .filter(file => !activeFiles.has(file.replace(/\\/g, '/')))
  .filter(file => !file.includes('/dev/') && !file.endsWith('.model.ts') && !file.endsWith('.interface.ts'))
  .forEach(file => console.log(file));
