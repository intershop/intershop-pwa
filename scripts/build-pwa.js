const { sync: spawnSync } = require('cross-spawn');
const {
  completeBuildConfigurations,
  getMainProject,
  getSelectedConfigurationNames,
  readAngularWorkspace,
  resolveTheme,
} = require('intershop-builders/dist/theme-configuration.js');

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

const workspace = readAngularWorkspace(process.cwd());
const project = getMainProject(workspace);
const target = { project, target: 'build' };
const configurations = completeBuildConfigurations(
  requestedConfiguration
    ? requestedConfiguration.split(',').filter(Boolean)
    : getSelectedConfigurationNames(workspace, target),
  clientOnly
);

resolveTheme(workspace, { ...target, configuration: configurations.join(',') });

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
