const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const workspaceRoot = join(__dirname, '..');

test('includes the child build script in the Docker build context and image', () => {
  const dockerfile = readFileSync(join(workspaceRoot, 'Dockerfile'), 'utf8');
  const dockerignore = readFileSync(join(workspaceRoot, '.dockerignore'), 'utf8');

  assert.match(dockerfile, /COPY[^\n]*scripts\/build-pwa\.js[^\n]*\/workspace\/scripts\//);
  assert.match(dockerignore, /^!scripts\/build-pwa\.js$/m);
});

test('uses a regular environment variable for the active Docker themes', () => {
  const dockerfile = readFileSync(join(workspaceRoot, 'Dockerfile'), 'utf8');

  assert.match(dockerfile, /RUN ACTIVE_THEMES="\$\{activeThemes\}" npm run build:multi/);
  assert.doesNotMatch(dockerfile, /RUN npm_config_active_themes=/);
});
