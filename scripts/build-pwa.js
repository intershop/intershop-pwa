// https://stackoverflow.com/questions/51388921/pass-command-line-args-to-npm-scripts-in-package-json/51401577

const execSync = require('child_process').execSync;

let configuration = process.env.npm_config_configuration;

if (configuration === 'true') {
  console.error('it seems you missed the equal sign in "--configuration=<config>"');
  process.exit(1);
}

if (!configuration) {
  configuration = process.env.npm_package_config_default_build_configuration || 'production';

  console.log(`falling back to configuration "${configuration}"`);
  console.log('you can run other configuration(s) with npm using the form "--configuration=<config1>,production"');
}

const client = process.argv[2] !== 'server';
const server = process.argv[2] !== 'client';
const partial = (client && server) || !(client && server);
const remainingArgs = process.argv.slice(partial ? 3 : 2);

if (client) {
  execSync(`npm run ng -- build -c ${configuration} ${remainingArgs.join(' ')}`, { stdio: 'inherit' });
}

if (server) {
  execSync(`npm run ng -- run intershop-pwa:server -c ${configuration} ${remainingArgs.join(' ')}`, {
    stdio: 'inherit',
  });
}
