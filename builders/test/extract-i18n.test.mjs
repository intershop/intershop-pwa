import assert from 'node:assert/strict';
import test from 'node:test';

import { createExtractI18nContext } from '../dist/extract-i18n.js';

const buildTarget = {
  project: 'intershop-pwa',
  target: 'build',
  configuration: 'b2c,development',
};

test('presents the custom build target as an Angular application builder', async () => {
  const context = {
    getBuilderNameForTarget: async () => '@angular-builders/custom-esbuild:application',
    getTargetOptions: async () => ({ untouched: true }),
  };
  const buildOptions = {
    browser: 'src/main.ts',
    fileReplacements: [{ replace: 'original.ts', with: 'replacement.b2c.ts' }],
    indexHtmlTransformer: './transform-index.ts',
    plugins: ['./define-build-constants.ts'],
  };

  const delegated = createExtractI18nContext(context, buildTarget, buildOptions);

  assert.equal(await delegated.getBuilderNameForTarget(buildTarget), '@angular-devkit/build-angular:application');
  assert.deepEqual(await delegated.getTargetOptions(buildTarget), {
    browser: 'src/main.ts',
    fileReplacements: [{ replace: 'original.ts', with: 'replacement.b2c.ts' }],
  });
});

test('delegates requests for other targets to the original context', async () => {
  const otherTarget = { project: 'intershop-pwa', target: 'build', configuration: 'b2b,development' };
  const context = {
    getBuilderNameForTarget: async target => `original:${target.configuration}`,
    getTargetOptions: async target => ({ configuration: target.configuration }),
  };

  const delegated = createExtractI18nContext(context, buildTarget, {});

  assert.equal(await delegated.getBuilderNameForTarget(otherTarget), 'original:b2b,development');
  assert.deepEqual(await delegated.getTargetOptions(otherTarget), { configuration: 'b2b,development' });
});
