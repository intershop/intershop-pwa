import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createExtractI18nContext, createThemedExtractI18nContext } from '../dist/extract-i18n.js';

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

test('applies theme replacements before delegating to the Angular extract-i18n builder', async () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'intershop-extract-i18n-'));
  const themedBuildTarget = { ...buildTarget, configuration: 'acme,development' };

  try {
    mkdirSync(join(workspaceRoot, 'src'));
    writeFileSync(
      join(workspaceRoot, 'angular.json'),
      JSON.stringify({
        projects: {
          'intershop-pwa': {
            root: '',
            architect: {
              build: {
                configurations: {
                  acme: { theme: 'acme' },
                },
              },
            },
          },
        },
      })
    );
    writeFileSync(join(workspaceRoot, 'src', 'example.ts'), 'export const value = "base";');
    writeFileSync(join(workspaceRoot, 'src', 'example.acme.ts'), 'export const value = "acme";');

    const context = {
      workspaceRoot,
      getBuilderNameForTarget: async () => '@angular-builders/custom-esbuild:application',
      getTargetOptions: async () => ({
        theme: 'acme',
        styles: ['src/styles/themes/theme_placeholder/style.scss'],
        fileReplacements: [
          {
            replace: 'src/environment.ts',
            with: 'src/environment.theme_placeholder.ts',
          },
        ],
        indexHtmlTransformer: './transform-index.ts',
        plugins: ['./define-build-constants.ts'],
      }),
    };

    const delegated = await createThemedExtractI18nContext(context, themedBuildTarget);

    assert.deepEqual(await delegated.getTargetOptions(themedBuildTarget), {
      styles: ['src/styles/themes/acme/style.scss'],
      fileReplacements: [
        { replace: 'src/environment.ts', with: 'src/environment.acme.ts' },
        { replace: 'src/example.ts', with: 'src/example.acme.ts' },
      ],
    });
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
