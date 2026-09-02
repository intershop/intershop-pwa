const { sync: spawnSync } = require('cross-spawn');
const { readFileSync } = require('fs');

const configurations = (
  process.env.npm_config_active_themes || JSON.parse(readFileSync('package.json')).config['active-themes']
).split(',');

const clientBuilds = [];
const serverBuilds = [];

const processArgs = process.argv.slice(2);
const extraArgs = processArgs.filter(a => a !== 'client' && a !== 'server').join(' ');

if (processArgs.includes('client') || !processArgs.includes('server'))
  clientBuilds.push(
    ...configurations.map(theme =>
      `build client --configuration=${theme},production -- --output-path=dist/${theme}/browser --progress=false ${extraArgs}`.trim()
    )
  );

if (processArgs.includes('server') || !processArgs.includes('client'))
  serverBuilds.push(
    ...configurations.map(theme =>
      `build server --configuration=${theme},production -- --output-path=dist/${theme}/server --progress=false ${extraArgs}`.trim()
    )
  );

const cores = +process.env.PWA_BUILD_MAX_WORKERS || Math.round(require('os').cpus().length / 3) || 1;
const parallel = cores === 1 ? [] : ['--max-parallel', cores, '--parallel'];
if (parallel.length) {
  console.log(`Using ${cores} cores for multi compile.`);
}

// Run client builds first, then server builds (server builds may depend on browser build artifacts)
let result = { status: 0 };
if (clientBuilds.length) {
  result = spawnSync('npm-run-all', ['--silent', ...parallel, ...clientBuilds], { stdio: 'inherit' });
}
if (result.status === 0 && serverBuilds.length) {
  result = spawnSync('npm-run-all', ['--silent', ...parallel, ...serverBuilds], { stdio: 'inherit' });
}
if (result.status !== 0) {
  process.exit(result.status);
}
