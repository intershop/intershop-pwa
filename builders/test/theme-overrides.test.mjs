import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { applyThemeOverrides, discoverThemeReplacements } from '../dist/theme-overrides.js';

const themes = ['b2b', 'b2c'];

test('prefers an exact theme override over shared and universal overrides', () => {
  const replacements = discoverThemeReplacements(
    ['src/example.ts', 'src/example.all.ts', 'src/example.b2b.b2c.ts', 'src/example.b2b.ts'],
    themes,
    'b2b'
  );

  assert.deepEqual(replacements, [{ replace: 'src/example.ts', with: 'src/example.b2b.ts' }]);
});

test('uses a shared theme override before a universal override', () => {
  const replacements = discoverThemeReplacements(
    ['src/example.ts', 'src/example.all.ts', 'src/example.b2b.b2c.ts'],
    themes,
    'b2b'
  );

  assert.deepEqual(replacements, [{ replace: 'src/example.ts', with: 'src/example.b2b.b2c.ts' }]);
});

test('rejects ambiguous overrides with the same priority', () => {
  assert.throws(
    () =>
      discoverThemeReplacements(['src/example.ts', 'src/example.b2b.b2c.ts', 'src/example.b2c.b2b.ts'], themes, 'b2b'),
    /Ambiguous theme overrides for "src\/example.ts"/
  );
});

test('ignores specifications, orphaned overrides, and overrides for other themes', () => {
  const replacements = discoverThemeReplacements(
    ['src/example.ts', 'src/example.b2b.spec.ts', 'src/orphan.b2b.ts', 'src/example.b2c.ts', 'src/example.all.ts'],
    themes,
    'b2b'
  );

  assert.deepEqual(replacements, [{ replace: 'src/example.ts', with: 'src/example.all.ts' }]);
});

test('normalizes Windows paths when discovering replacements', () => {
  const replacements = discoverThemeReplacements(['src\\example.ts', 'src\\example.b2b.ts'], themes, 'b2b');

  assert.deepEqual(replacements, [{ replace: 'src/example.ts', with: 'src/example.b2b.ts' }]);
});

test('merges discovered overrides without removing unrelated explicit replacements', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'intershop-theme-overrides-'));

  try {
    mkdirSync(join(workspaceRoot, 'src'));
    writeFileSync(
      join(workspaceRoot, 'angular.json'),
      JSON.stringify({
        projects: {
          app: {
            root: '',
            architect: {
              build: {
                configurations: {
                  b2b: { theme: 'b2b' },
                  b2c: { theme: 'b2c' },
                },
              },
            },
          },
        },
      })
    );
    writeFileSync(join(workspaceRoot, 'src', 'example.ts'), 'export const value = "base";');
    writeFileSync(join(workspaceRoot, 'src', 'example.b2b.ts'), 'export const value = "b2b";');

    const build = applyThemeOverrides(
      {
        fileReplacements: [
          { replace: 'src/environment.ts', with: 'src/environment.production.ts' },
          { replace: 'src\\example.ts', with: 'src\\example.legacy.ts' },
        ],
      },
      workspaceRoot,
      { project: 'app', target: 'build', configuration: 'b2b' }
    );

    assert.deepEqual(build.options.fileReplacements, [
      { replace: 'src/environment.ts', with: 'src/environment.production.ts' },
      { replace: 'src/example.ts', with: 'src/example.b2b.ts' },
    ]);
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
