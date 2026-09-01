const assert = require('node:assert/strict');
const { mkdirSync, mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const test = require('node:test');

const { applyThemeOverrides, discoverThemeReplacements } = require('intershop-builders/dist/theme-overrides.js');
const {
  getThemeConfigurations,
  replaceThemePlaceholder,
  resolveTheme,
} = require('intershop-builders/dist/theme-configuration.js');

function createWorkspace() {
  return {
    projects: {
      'intershop-pwa': {
        root: '',
        architect: {
          build: {
            defaultConfiguration: 'b2b,production',
            configurations: {
              development: {},
              production: {},
              ssr: {},
              b2b: { theme: 'b2b' },
              b2c: { theme: 'b2c' },
              acme: { theme: 'acme' },
            },
          },
        },
      },
      subproject: {
        root: 'projects/subproject',
        architect: {
          build: {
            options: { theme: 'b2b' },
          },
        },
      },
    },
  };
}

test('derives themes from explicit Angular theme configurations', () => {
  assert.deepEqual(getThemeConfigurations(createWorkspace()), [
    { configuration: 'b2b', theme: 'b2b' },
    { configuration: 'b2c', theme: 'b2c' },
    { configuration: 'acme', theme: 'acme' },
  ]);
});

test('requires the configuration and theme names to match', () => {
  const workspace = createWorkspace();
  workspace.projects['intershop-pwa'].architect.build.configurations.alias = { theme: 'acme' };

  assert.throws(() => getThemeConfigurations(workspace), /Theme configuration "alias" must use the same theme name/);
});

test('resolves defaults, explicit custom themes, and subproject options', () => {
  const workspace = createWorkspace();

  assert.equal(resolveTheme(workspace, { project: 'intershop-pwa', target: 'build' }).theme, 'b2b');
  assert.equal(
    resolveTheme(workspace, { project: 'intershop-pwa', target: 'build', configuration: 'acme,production' }).theme,
    'acme'
  );
  assert.equal(resolveTheme(workspace, { project: 'subproject', target: 'build' }).theme, 'b2b');
});

test('rejects builds that select multiple themes', () => {
  assert.throws(
    () =>
      resolveTheme(createWorkspace(), {
        project: 'intershop-pwa',
        target: 'build',
        configuration: 'b2b,acme,production',
      }),
    /Expected exactly one theme configuration, found: b2b, acme/
  );
});

test('replaces theme placeholders recursively without mutating the input', () => {
  const input = {
    styles: ['src/styles/themes/theme_placeholder/style.scss'],
    asset: { input: 'src/assets/themes/theme_placeholder/img' },
  };

  assert.deepEqual(replaceThemePlaceholder(input, 'acme'), {
    styles: ['src/styles/themes/acme/style.scss'],
    asset: { input: 'src/assets/themes/acme/img' },
  });
  assert.equal(input.styles[0], 'src/styles/themes/theme_placeholder/style.scss');
});

test('discovers universal TypeScript overrides', () => {
  assert.deepEqual(
    discoverThemeReplacements(['src/example.component.ts', 'src/example.component.all.ts'], ['b2b', 'b2c'], 'b2b'),
    [{ replace: 'src/example.component.ts', with: 'src/example.component.all.ts' }]
  );
});

test('applies a manually configured custom theme end to end', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'intershop-theme-'));
  const workspace = createWorkspace();

  try {
    mkdirSync(join(workspaceRoot, 'src'));
    writeFileSync(join(workspaceRoot, 'angular.json'), JSON.stringify(workspace));
    writeFileSync(join(workspaceRoot, 'src', 'example.ts'), 'export const value = "base";');
    writeFileSync(join(workspaceRoot, 'src', 'example.acme.ts'), 'export const value = "acme";');

    const build = applyThemeOverrides(
      {
        theme: 'acme',
        styles: ['src/styles/themes/theme_placeholder/style.scss'],
        fileReplacements: [
          {
            replace: 'src/environments/environment.ts',
            with: 'src/environments/environment.theme_placeholder.ts',
          },
        ],
      },
      workspaceRoot,
      { project: 'intershop-pwa', target: 'build', configuration: 'acme,production' }
    );

    assert.equal(build.theme, 'acme');
    assert.equal(build.count, 1);
    assert.deepEqual(build.options.styles, ['src/styles/themes/acme/style.scss']);
    assert.deepEqual(build.options.fileReplacements, [
      {
        replace: 'src/environments/environment.ts',
        with: 'src/environments/environment.acme.ts',
      },
      { replace: 'src/example.ts', with: 'src/example.acme.ts' },
    ]);
    assert.equal('theme' in build.options, false);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
