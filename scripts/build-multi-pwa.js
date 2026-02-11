const { sync: spawnSync } = require('cross-spawn');
const { readFileSync, writeFileSync } = require('fs');

const configurations = (
  process.env.npm_config_active_themes || JSON.parse(readFileSync('package.json')).config['active-themes']
)
  .split(',')
  .map((theme, index) => ({ theme, port: 4000 + index }));

const processArgs = process.argv.slice(2);
const extraArgs = processArgs.filter(a => a !== 'client' && a !== 'server').join(' ');

const clientBuilds = processArgs.includes('client') || !processArgs.includes('server');
const serverBuilds = processArgs.includes('server') || !processArgs.includes('client');

/**
 * Spawns a child process and returns a promise that resolves when it completes.
 */
function spawnAsync(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = cp.spawn(command, args, { shell: true, ...options });
    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(' ')}`));
      }
    });
    child.on('error', reject);
  });
}

/**
 * Builds bundles in parallel for all themes.
 */
async function buildParallel(type, buildFn) {
  console.log(`\nBuilding ${type} bundles in parallel...`);
  const startTime = Date.now();

  await Promise.all(configurations.map(({ theme }) => buildFn(theme)));

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✔ All ${type} bundles built in ${duration}s`);
}

async function main() {
  // Build client bundles in parallel
  if (clientBuilds) {
    await buildParallel('client', theme =>
      spawnAsync(
        'npm',
        [
          'run',
          'build',
          'client',
          '--',
          `--configuration=${theme},production`,
          `--output-path=dist/${theme}/browser`,
          '--progress=false',
          extraArgs,
        ].filter(Boolean),
        { stdio: 'inherit' }
      )
    );

    // Inject critical split chunks for each built theme.
    configurations.forEach(({ theme }) => {
      const distPath = path.join('dist', theme, 'browser');
      if (fs.existsSync(distPath)) {
        cp.execSync(`node scripts/inject-lib-chunks.js ${theme}`, { stdio: 'inherit' });
      }
    });
  }

  // Build server bundles in parallel
  if (serverBuilds) {
    await buildParallel('server', theme =>
      spawnAsync(
        'npm',
        [
          'run',
          'ng',
          '--',
          'run',
          `intershop-pwa:server:${theme},production`,
          `--output-path=dist/${theme}/server`,
          '--progress=false',
          extraArgs,
        ].filter(Boolean),
        { stdio: 'inherit' }
      )
    );
  }
}

main()
  .then(() => {
    fs.writeFileSync(
      'src/ssr/server-scripts/ecosystem-ports.json',
      JSON.stringify(
        configurations.reduce((acc, { theme, port }) => ({ ...acc, [theme]: port }), {}),
        undefined,
        2
      )
    );

    // Only create run-standalone.js if server build was done
    if (serverBuilds) {
      configurations.forEach(({ theme }) => {
        const serverPath = path.join('dist', theme, 'server');
        if (fs.existsSync(serverPath)) {
          fs.writeFileSync(
            `dist/${theme}/run-standalone.js`,
            `const path = require('path');
process.env.BROWSER_FOLDER = path.join(__dirname, 'browser');
require('child_process').fork(path.join(__dirname, 'server', 'main'));
`
          );
        }
      });
    }
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
