const { chmodSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const { basename, join } = require('path');
const { buildSync } = require('esbuild');

const sourceFolder = join('src', 'ssr', 'server-scripts');
const outputFolder = 'dist';

mkdirSync(outputFolder, { recursive: true });

['distributor.js', 'prometheus.js'].forEach(entry => {
  buildSync({
    entryPoints: [join(sourceFolder, entry)],
    bundle: true,
    external: ['pm2'],
    format: 'cjs',
    outfile: join(outputFolder, `${basename(entry, '.js')}.cjs`),
    platform: 'node',
    target: 'node22',
  });
});

['build-ecosystem.cjs', 'entrypoint.sh', 'healthcheck.cjs'].forEach(file =>
  copyFileSync(join(sourceFolder, file), join(outputFolder, file))
);
chmodSync(join(outputFolder, 'entrypoint.sh'), 0o755);

const lockFile = JSON.parse(readFileSync('package-lock.json', { encoding: 'utf-8' }));
const pm2Version = lockFile.packages['node_modules/pm2']?.version;

if (!pm2Version) {
  console.error('PM2 is missing from package-lock.json.');
  process.exit(1);
}

writeFileSync(
  join(outputFolder, 'package.json'),
  JSON.stringify(
    {
      private: true,
      dependencies: {
        pm2: pm2Version,
      },
    },
    undefined,
    2
  )
);
