const { sync: spawnSync } = require('cross-spawn');

const args = process.argv.slice(2);
const configurationIndex = args.findIndex(arg => arg === '--configuration' || arg.startsWith('--configuration='));

let theme = process.env.npm_config_configuration || 'b2b';

if (configurationIndex !== -1) {
  const configuration = args[configurationIndex];
  theme = configuration.includes('=')
    ? configuration.slice(configuration.indexOf('=') + 1)
    : args[configurationIndex + 1];
  args.splice(configurationIndex, configuration.includes('=') ? 1 : 2);
}

if (!['b2b', 'b2c'].includes(theme)) {
  console.error(`Unsupported build configuration "${theme}". Expected "b2b" or "b2c".`);
  process.exit(1);
}

const result = spawnSync('npm', ['run', `build:${theme}`, '--', ...args], { stdio: 'inherit' });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
