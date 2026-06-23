const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const statsPath = process.argv[2] || path.join('dist', 'stats.json');

if (!fs.existsSync(statsPath)) {
  console.error(`Missing application builder stats file: ${statsPath}`);
  console.error('Run `npm run build -- --stats-json` first.');
  process.exit(1);
}

const metafile = fs.readFileSync(statsPath, { encoding: 'utf-8' });

console.log(esbuild.analyzeMetafileSync(metafile, { verbose: process.argv.includes('--verbose') }));
