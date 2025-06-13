const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const configurations = (
  process.env.npm_config_active_themes || JSON.parse(fs.readFileSync('package.json')).config['active-themes']
)
  .split(',')
  .map((theme, index) => ({ theme, port: 4000 + index }));

const builds = [];
const processArgs = process.argv.slice(2);
const extraArgs = processArgs.filter(a => a !== 'client' && a !== 'server').join(' ');

if (processArgs.includes('client') || !processArgs.includes('server')) {
  builds.push(
    ...configurations.map(({ theme }) =>
      `ng run intershop-pwa:build:${theme},production --output-path=dist/${theme}/browser ${extraArgs}`.trim()
    )
  );
}

if (processArgs.includes('server') || !processArgs.includes('client')) {
  builds.push(
    ...configurations.map(({ theme }) =>
      `ng run intershop-pwa:server:${theme},production --output-path=dist/${theme}/server ${extraArgs}`.trim()
    )
  );
}

console.log('Executing builds...');
for (const build of builds) {
  console.log(`Running: ${build}`);

  const parts = build.split(' ');
  const command = parts[0];
  const args = parts.slice(1);

  const result = cp.spawnSync('npx', [command, ...args], {
    stdio: 'inherit',
    shell: true,
    windowsHide: true,
  });

  if (result.status !== 0) {
    console.error(`Build failed: ${build}`);
    process.exit(result.status);
  }
}

fs.writeFileSync(
  'src/ssr/server-scripts/ecosystem-ports.json',
  JSON.stringify(
    configurations.reduce((acc, { theme, port }) => ({ ...acc, [theme]: port }), {}),
    undefined,
    2
  )
);

configurations.forEach(({ theme }) => {
  const serverDir = path.join('dist', theme, 'server');
  const browserDir = path.join('dist', theme, 'browser');

  if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });
  if (!fs.existsSync(browserDir)) fs.mkdirSync(browserDir, { recursive: true });

  fs.writeFileSync(
    path.join('dist', theme, 'run-standalone.js'),
    `const path = require('path');
process.env.BROWSER_FOLDER = path.join(__dirname, 'browser');
require('child_process').fork(path.join(__dirname, 'server', 'main.js'));
`
  );
});

console.log('Build process completed successfully.');
