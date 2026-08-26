const { mkdirSync, readFileSync, writeFileSync } = require('fs');
const { sync: spawnSync } = require('cross-spawn');

const packageJson = JSON.parse(readFileSync('package.json', { encoding: 'utf-8' }));
const activeThemes = (process.env.npm_config_active_themes || packageJson.config['active-themes'])
  .split(',')
  .map(theme => theme.trim())
  .filter(Boolean);
const clientOnly = process.argv.includes('client');
const buildArguments = process.argv.slice(2).filter(argument => argument !== 'client');

if (!activeThemes.length) {
  console.error('No active themes configured.');
  process.exit(1);
}

const ports = {};

activeThemes.forEach((theme, index) => {
  const buildScript = clientOnly ? `build:client:${theme}` : `build:${theme}`;
  if (!packageJson.scripts[buildScript]) {
    console.error(`Missing npm script "${buildScript}".`);
    process.exit(1);
  }

  const result = spawnSync('npm', ['run', buildScript, '--', ...buildArguments, `--output-path=dist/${theme}`], {
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status);
  }

  ports[theme] = 4000 + index;
});

if (clientOnly) {
  process.exit(0);
}

mkdirSync('dist', { recursive: true });
writeFileSync('dist/ecosystem-ports.json', JSON.stringify(ports, undefined, 2));

const runtimeBuild = spawnSync('npm', ['run', 'build:ssr-runtime'], { stdio: 'inherit' });
process.exit(runtimeBuild.status);
