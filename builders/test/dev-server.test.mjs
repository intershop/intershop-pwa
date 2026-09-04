import assert from 'node:assert/strict';
import test from 'node:test';

import { createDevServerContext } from '../dist/dev-server.js';

const buildTarget = {
  project: 'intershop-pwa',
  target: 'build',
  configuration: 'acme,development',
};

test('presents themed build options through the Angular application builder', async () => {
  const context = {
    getBuilderNameForTarget: async () => '@angular-builders/custom-esbuild:application',
    getTargetOptions: async () => ({ untouched: true }),
  };
  const themedBuildOptions = {
    browser: 'src/main.ts',
    fileReplacements: [{ replace: 'original.ts', with: 'replacement.acme.ts' }],
  };

  const delegated = createDevServerContext(context, buildTarget, themedBuildOptions);

  assert.equal(await delegated.getBuilderNameForTarget(buildTarget), '@angular/build:application');
  assert.deepEqual(await delegated.getTargetOptions(buildTarget), themedBuildOptions);
});

test('delegates unrelated targets to the original builder context', async () => {
  const otherTarget = { project: 'intershop-pwa', target: 'build', configuration: 'b2b,development' };
  const context = {
    getBuilderNameForTarget: async target => `original:${target.configuration}`,
    getTargetOptions: async target => ({ configuration: target.configuration }),
  };

  const delegated = createDevServerContext(context, buildTarget, {});

  assert.equal(await delegated.getBuilderNameForTarget(otherTarget), 'original:b2b,development');
  assert.deepEqual(await delegated.getTargetOptions(otherTarget), { configuration: 'b2b,development' });
});
