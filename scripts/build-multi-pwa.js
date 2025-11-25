const cp = require('child_process');
const fs = require('fs');

const configurations = (
  process.env.npm_config_active_themes || JSON.parse(fs.readFileSync('package.json')).config['active-themes']
)
  .split(',')
  .map((theme, index) => ({ theme, port: 4000 + index }));

const builds = [];

const processArgs = process.argv.slice(2);
const extraArgs = processArgs.filter(a => a !== 'client' && a !== 'server').join(' ');

if (processArgs.includes('client') || !processArgs.includes('server'))
  builds.push(
    ...configurations.map(({ theme }) =>
      `build client --configuration=${theme},production -- --output-path=dist/${theme}/browser --progress=false ${extraArgs}`.trim()
    )
  );

if (processArgs.includes('server') || !processArgs.includes('client'))
  builds.push(
    ...configurations.map(({ theme }) =>
      `build server --configuration=${theme},production -- --output-path=dist/${theme}/server --progress=false ${extraArgs}`.trim()
    )
  );

const cores = +process.env.PWA_BUILD_MAX_WORKERS || Math.round(require('os').cpus().length / 3) || 1;
console.log(`Using ${cores} cores for multi compile.`);

// Convert build commands to proper npm script calls
const buildCommands = builds.map(buildCmd => {
  // Convert "build client --configuration=b2b,production -- --output-path=dist/b2b/browser --progress=false"
  // to "npm run ng -- build --configuration=b2b,production --output-path=dist/b2b/browser --progress=false"
  const parts = buildCmd.split(' -- ');
  const mainCmd = parts[0]; // "build client --configuration=b2b,production"
  const extraArgs = parts[1] || ''; // "--output-path=dist/b2b/browser --progress=false"

  const cmdParts = mainCmd.split(' ');
  const target = cmdParts[1]; // "client" or "server"
  const configArg = cmdParts.find(part => part.startsWith('--configuration=')); // "--configuration=b2b,production"

  if (target === 'client') {
    return `npm run ng -- build ${configArg} ${extraArgs}`.trim();
  } else {
    // For server, convert --configuration=theme,env to :theme,env format
    const configValue = configArg ? configArg.replace('--configuration=', '') : '';
    return `npm run ng -- run intershop-pwa:server:${configValue} ${extraArgs}`.trim();
  }
});

// Function to run commands in parallel with limited concurrency
function runInParallel(commands, maxConcurrency) {
  return new Promise((resolve, reject) => {
    let running = 0;
    let hasError = false;
    const queue = [...commands];

    function runNext() {
      if (hasError || (queue.length === 0 && running === 0)) {
        if (hasError) {
          reject(new Error('One or more builds failed'));
        } else {
          resolve();
        }
        return;
      }

      if (queue.length > 0 && running < maxConcurrency) {
        const command = queue.shift();
        running++;

        console.log(`Starting: ${command}`);
        const child = cp.exec(command, { cwd: process.cwd() });

        child.on('close', code => {
          running--;

          if (code !== 0) {
            console.error(`Command failed with code ${code}: ${command}`);
            hasError = true;
          } else {
            console.log(`Completed: ${command}`);
          }

          runNext();
        });

        child.on('error', err => {
          console.error(`Error executing command: ${command}`, err);
          hasError = true;
        });

        // Start next command if we haven't reached max concurrency
        setImmediate(runNext);
      }
    }

    runNext();
  });
}

// Run builds in parallel
runInParallel(buildCommands, cores)
  .then(() => {
    console.log('All builds completed successfully');

    // Write ecosystem ports configuration
    fs.writeFileSync(
      'src/ssr/server-scripts/ecosystem-ports.json',
      JSON.stringify(
        configurations.reduce((acc, { theme, port }) => ({ ...acc, [theme]: port }), {}),
        undefined,
        2
      )
    );

    // Write standalone run scripts for each theme
    configurations.forEach(({ theme }) => {
      fs.writeFileSync(
        `dist/${theme}/run-standalone.js`,
        `const path = require('path');
process.env.BROWSER_FOLDER = path.join(__dirname, 'browser');
require('child_process').fork(path.join(__dirname, 'server', 'main'));
`
      );
    });

    console.log('Configuration files written successfully');
  })
  .catch(error => {
    console.error('Build failed:', error.message);
    process.exit(1);
  });
