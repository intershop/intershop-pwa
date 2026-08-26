const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { collectWorkspaceSources, validateStats } = require('./active-localization-files');

describe('collectWorkspaceSources', () => {
  it('collects effective build sources and rejects incomplete metadata', () => {
    const stats = {
      inputs: {
        'src/main.ts': {},
        'node_modules/example/index.js': {},
      },
    };
    const sourceMaps = [
      {
        sources: [
          'src/main.ts',
          'src/lazy/lazy.component.ts',
          'src/lazy/lazy.component.html',
          'src/lazy/lazy.component.scss',
          'src/environments/environment.b2c.ts',
          'node_modules/example/index.js',
        ],
      },
    ];

    validateStats(stats, 'b2c');
    assert.deepEqual(collectWorkspaceSources(sourceMaps, 'b2c'), [
      'src/environments/environment.b2c.ts',
      'src/lazy/lazy.component.html',
      'src/lazy/lazy.component.scss',
      'src/lazy/lazy.component.ts',
      'src/main.ts',
    ]);
    assert.throws(
      () => collectWorkspaceSources([{ sources: ['src/main.ts'] }], 'b2c'),
      /contain no workspace \.html files/
    );
    assert.throws(() => validateStats({}, 'b2c'), /contains no workspace TypeScript inputs/);
  });
});
