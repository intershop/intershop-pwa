// https://stackoverflow.com/questions/51388921/pass-command-line-args-to-npm-scripts-in-package-json/51401577

const execSync = require('child_process').execSync;

let configuration = process.env.npm_config_configuration;

if (configuration === 'true') {
  console.error('it seems you missed the equal sign in "--configuration=<config>"');
  process.exit(1);
}

let configString = '';

if (configuration) {
  configString = '-c ' + configuration;
}

const client = process.argv[2] !== 'server';
const server = process.argv[2] !== 'client';
const partial = (!client && server) || (client && !server);
const remainingArgs = process.argv.slice(partial ? 3 : 2);

if (client) {
  execSync(`npm run ng -- build ${configString} ${remainingArgs.join(' ')}`, {
    stdio: 'inherit',
  });
}

if (server) {
  execSync(`npm run ng -- run intershop-pwa:server ${configString} ${remainingArgs.join(' ')}`, {
    stdio: 'inherit',
  });
}
