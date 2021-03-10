// https://stackoverflow.com/questions/51388921/pass-command-line-args-to-npm-scripts-in-package-json/51401577

const execSync = require('child_process').execSync;

let configuration = process.env.npm_config_configuration;

if (configuration === 'true') {
  console.error('it seems you missed the equal sign in "--configuration=<config>"');
  process.exit(1);
}

if (!configuration) {
  console.log('falling back to configuration "production"');
  configuration = 'production';
  console.log('you can run other configuration(s) with npm using the form "--configuration=<config1>,production"');
}

execSync('npm run ng -- build -c ' + configuration, { stdio: [0, 1, 2] });
execSync('npm run ng -- run intershop-pwa:server -c ' + configuration, { stdio: [0, 1, 2] });
