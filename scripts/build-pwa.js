const { readFileSync } = require('fs');
const { sync: spawnSync } = require('cross-spawn');

const args = process.argv.slice(2);
const clientOnly = args.includes('client');
const buildArguments = args.filter(argument => argument !== 'client');
const configurationIndex = buildArguments.findIndex(
  argument => argument === '--configuration' || argument.startsWith('--configuration=')
);

let requestedConfiguration = process.env.npm_config_configuration;
if (requestedConfiguration === 'true') {
  console.error('It seems you missed the equal sign in "--configuration=<config>".');
  process.exit(1);
}

if (configurationIndex !== -1) {
  const configurationArgument = buildArguments[configurationIndex];
  requestedConfiguration = configurationArgument.includes('=')
    ? configurationArgument.slice(configurationArgument.indexOf('=') + 1)
    : buildArguments[configurationIndex + 1];
  buildArguments.splice(configurationIndex, configurationArgument.includes('=') ? 1 : 2);
}

const workspace = JSON.parse(readFileSync('angular.json', 'utf8'));
const project = Object.entries(workspace.projects).find(([, definition]) => definition.root === '')?.[0];
if (!project) {
  console.error('Could not find the main Angular project.');
  process.exit(1);
}

const build = workspace.projects[project].architect?.build ?? workspace.projects[project].targets?.build;
const configurations = (requestedConfiguration || build?.defaultConfiguration || 'b2b,production')
  .split(',')
  .filter(Boolean);

if (!configurations.includes('development') && !configurations.includes('production')) {
  configurations.push('production');
}
if (clientOnly) {
  const ssrIndex = configurations.indexOf('ssr');
  if (ssrIndex !== -1) {
    configurations.splice(ssrIndex, 1);
  }
} else if (!configurations.includes('ssr')) {
  configurations.push('ssr');
}

const result = spawnSync(
  'node',
  [
    '--require',
    './scripts/remove-data-testing-attributes.cjs',
    './node_modules/@angular/cli/bin/ng.js',
    'run',
    `${project}:build:${configurations.join(',')}`,
    ...buildArguments,
  ],
  { stdio: 'inherit' }
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
