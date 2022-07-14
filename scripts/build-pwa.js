const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

/**
 * remove service worker cache check for resources (especially index.html)
 * https://github.com/angular/angular/issues/23613#issuecomment-415886919
 */
function removeServiceWorkerCacheCheck(args) {
  const outputPathArg = args.find(arg => arg.startsWith('--output-path'));

  let outputPath = '';
  if (outputPathArg) {
    // get outputPath from build args (in case of build:multi)
    outputPath = outputPathArg.split('=')[1];
  } else {
    // get default outputPath from angular.json
    const angularJson = JSON.parse(fs.readFileSync('./angular.json', { encoding: 'utf-8' }));
    outputPath = angularJson.projects[angularJson.defaultProject].architect.build.options.outputPath;
  }

  const serviceWorkerScript = path.join(outputPath, 'ngsw-worker.js');
  if (fs.existsSync(serviceWorkerScript)) {
    console.warn('replacing cache check for service worker in', serviceWorkerScript);
    const script = fs.readFileSync(serviceWorkerScript, { encoding: 'utf-8' });
    fs.writeFileSync(serviceWorkerScript, script.replace('canonicalHash !== cacheBustedHash', 'false'));
  }
}

// https://stackoverflow.com/questions/51388921/pass-command-line-args-to-npm-scripts-in-package-json/64694166#64694166
let configuration = process.env.npm_config_configuration;

if (configuration === 'true') {
  console.error('it seems you missed the equal sign in "--configuration=<config>"');
  process.exit(1);
}

let configString = '';

if (configuration) {
  configString = '-c ' + configuration;
}

const processArgs = process.argv.slice(2);
const client = processArgs.includes('client') || !processArgs.includes('server');
const server = processArgs.includes('server') || !processArgs.includes('client');
const remainingArgs = processArgs.filter(a => a !== 'client' && a !== 'server');

if (client) {
  execSync(`npm run ng -- build ${configString} ${remainingArgs.join(' ')}`, {
    stdio: 'inherit',
  });
  removeServiceWorkerCacheCheck(remainingArgs);
}

if (configuration) {
  configString = ':' + configuration;
}

if (server) {
  execSync(`npm run ng -- run intershop-pwa:server${configString} ${remainingArgs.join(' ')}`, {
    stdio: 'inherit',
  });
}
