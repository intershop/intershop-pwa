const { chmodSync, copyFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const sourceFolder = join('src', 'ssr', 'server-scripts');
const outputFolder = 'dist';

mkdirSync(outputFolder, { recursive: true });
['entrypoint.sh', 'healthcheck.js'].forEach(file => copyFileSync(join(sourceFolder, file), join(outputFolder, file)));
chmodSync(join(outputFolder, 'entrypoint.sh'), 0o755);
