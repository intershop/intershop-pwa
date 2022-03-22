const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const configurations = (
  process.env.npm_config_active_themes || JSON.parse(fs.readFileSync('package.json')).config['active-themes']
)
  .split(',')
  .map((theme, index) => ({ theme, port: 4000 + index }));

const builds = [];

const processArgs = process.argv.slice(2);
const extraArgs = processArgs.filter(a => a !== 'client' && a !== 'server').join(' ');

if (processArgs.includes('client') || !processArgs.includes('server'))
  builds.push(
    ...configurations.map(({ theme }) =>
      `build client --configuration=${theme},production -- --output-path=dist/${theme}/browser --progress=false ${extraArgs}`.trim()
    )
  );

if (processArgs.includes('server') || !processArgs.includes('client'))
  builds.push(
    ...configurations.map(({ theme }) =>
      `build server --configuration=${theme},production -- --output-path=dist/${theme}/server --progress=false ${extraArgs}`.trim()
    )
  );

const cores = +process.env.PWA_BUILD_MAX_WORKERS || Math.round(require('os').cpus().length / 3) || 1;
const parallel = cores === 1 ? [] : ['--max-parallel', cores, '--parallel'];
if (parallel) {
  console.log(`Using ${cores} cores for multi compile.`);
}

const result = cp.spawnSync(
  path.join('node_modules', '.bin', 'npm-run-all' + (process.platform === 'win32' ? '.cmd' : '')),
  ['--silent', ...parallel, ...builds],
  {
    stdio: 'inherit',
  }
);
if (result.status !== 0) {
  process.exit(result.status);
}

fs.writeFileSync(
  'src/ssr/server-scripts/ecosystem-ports.json',
  JSON.stringify(
    configurations.reduce((acc, { theme, port }) => ({ ...acc, [theme]: port }), {}),
    undefined,
    2
  )
);

configurations.forEach(({ theme }) => {
  fs.writeFileSync(
    `dist/${theme}/run-standalone.js`,
    `const path = require('path');
process.env.BROWSER_FOLDER = path.join(__dirname, 'browser');
require('child_process').fork(path.join(__dirname, 'server', 'main'));
`
  );
});
