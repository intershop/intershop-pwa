const { mkdirSync, readFileSync, writeFileSync } = require('fs');
const { sync: spawnSync } = require('cross-spawn');
const { readAngularWorkspace, resolveActiveThemes } = require('intershop-builders/dist/theme-configuration.js');

const packageJson = JSON.parse(readFileSync('package.json', { encoding: 'utf-8' }));
const workspace = readAngularWorkspace(process.cwd());
const configuredThemes =
  process.env.ACTIVE_THEMES || process.env.npm_config_active_themes || packageJson.config?.['active-themes'];

let activeThemes;
try {
  activeThemes = resolveActiveThemes(workspace, configuredThemes);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const clientOnly = process.argv.includes('client');
const buildArguments = process.argv.slice(2).filter(argument => argument !== 'client');
const ports = {};

activeThemes.forEach((theme, index) => {
  const result = spawnSync(
    'node',
    [
      'scripts/build-pwa.js',
      ...(clientOnly ? ['client'] : []),
      `--configuration=${theme}`,
      ...buildArguments,
      `--output-path=dist/${theme}`,
    ],
    { stdio: 'inherit' }
  );
  if (result.error) {
    throw result.error;
  }
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
if (runtimeBuild.error) {
  throw runtimeBuild.error;
}
process.exit(runtimeBuild.status ?? 1);
