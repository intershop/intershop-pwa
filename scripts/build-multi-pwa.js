const { sync: spawnSync } = require('cross-spawn');
const { readdirSync, readFileSync, statSync, writeFileSync } = require('fs');
const { basename, join } = require('path');

const configurations = (
  process.env.npm_config_active_themes || JSON.parse(readFileSync('package.json')).config['active-themes']
)
  .split(',')
  .map((theme, index) => ({ theme, port: 4000 + index }));

const processArgs = process.argv.slice(2);
const extraArgs = processArgs.filter(arg => arg !== 'client' && arg !== 'server');

if (processArgs.includes('client') || processArgs.includes('server')) {
  console.warn('Application builder creates browser and server bundles in a single build.');
}

const builds = configurations.map(({ theme }) =>
  [
    'build',
    `--configuration=${theme},production`,
    '--',
    `--output-path=dist/${theme}`,
    '--progress=false',
    ...extraArgs,
  ].join(' ')
);

function hasThemeSpecificResourceOverride(folder = process.cwd()) {
  const ignoredFolders = new Set(['.angular', '.git', 'dist', 'node_modules']);
  const activeThemes = configurations.map(({ theme }) => theme);
  const resourceOverrideExtensions = ['.html', '.scss'];

  for (const entry of readdirSync(folder)) {
    if (ignoredFolders.has(entry)) {
      continue;
    }

    const path = join(folder, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (hasThemeSpecificResourceOverride(path)) {
        return true;
      }
    } else if (
      resourceOverrideExtensions.some(extension => entry.endsWith(extension)) &&
      activeThemes.some(theme => basename(entry).includes(`.${theme}.`))
    ) {
      return true;
    }
  }

  return false;
}

const maxWorkers = Math.max(1, +process.env.PWA_BUILD_MAX_WORKERS || configurations.length);
const runAllArgs = ['--silent'];
if (maxWorkers > 1 && builds.length > 1 && !hasThemeSpecificResourceOverride()) {
  runAllArgs.push('--parallel', '--max-parallel', `${maxWorkers}`);
} else if (maxWorkers > 1 && builds.length > 1) {
  console.warn(
    'Application builder multi compile runs sequentially because theme-specific resource overrides are not parallel-safe.'
  );
}

const result = spawnSync('npm-run-all', [...runAllArgs, ...builds], { stdio: 'inherit' });
if (result.status !== 0) {
  process.exit(result.status);
}

writeFileSync(
  'src/ssr/server-scripts/ecosystem-ports.json',
  JSON.stringify(
    configurations.reduce((acc, { theme, port }) => ({ ...acc, [theme]: port }), {}),
    undefined,
    2
  )
);

configurations.forEach(({ theme }) => {
  writeFileSync(
    `dist/${theme}/run-standalone.js`,
    `const path = require('path');
process.env.BROWSER_FOLDER = path.join(__dirname, 'browser');
require('child_process').fork(path.join(__dirname, 'server', 'main'));
`
  );
});
