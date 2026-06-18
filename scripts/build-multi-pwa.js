const { sync: spawnSync } = require('cross-spawn');
const { readFileSync, writeFileSync } = require('fs');

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

if (+process.env.PWA_BUILD_MAX_WORKERS > 1) {
  console.warn('Application builder multi compile runs sequentially while the runner patches angular.json.');
}

const result = spawnSync('npm-run-all', ['--silent', ...builds], { stdio: 'inherit' });
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
