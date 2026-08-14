import { discoverThemeReplacements } from './theme-overrides';

describe('Theme Overrides', () => {
  const original = 'src/app/example/example.component.ts';

  it('should use an override for the active theme', () => {
    expect(discoverThemeReplacements([original, 'src/app/example/example.component.b2c.ts'], ['b2b', 'b2c'], 'b2c'))
      .toMatchInlineSnapshot(`
      [
        {
          "replace": "src/app/example/example.component.ts",
          "with": "src/app/example/example.component.b2c.ts",
        },
      ]
    `);
  });

  it('should use all as fallback and prefer a specific override', () => {
    const files = [original, 'src/app/example/example.component.all.ts', 'src/app/example/example.component.b2c.ts'];

    expect(discoverThemeReplacements(files, ['b2b', 'b2c'], 'b2b')[0].with).toEndWith('.all.ts');
    expect(discoverThemeReplacements(files, ['b2b', 'b2c'], 'b2c')[0].with).toEndWith('.b2c.ts');
  });

  it('should support overrides shared by several themes', () => {
    const files = [original, 'src/app/example/example.component.b2b.b2c.ts'];

    expect(discoverThemeReplacements(files, ['b2b', 'b2c'], 'b2b')).toHaveLength(1);
    expect(discoverThemeReplacements(files, ['b2b', 'b2c'], 'b2c')).toHaveLength(1);
  });

  it('should ignore overrides without an original file', () => {
    expect(discoverThemeReplacements(['src/app/example/example.component.b2c.ts'], ['b2b', 'b2c'], 'b2c')).toBeEmpty();
  });

  it('should use the first matching specific override', () => {
    const replacements = discoverThemeReplacements(
      [original, 'src/app/example/example.component.b2c.ts', 'src/app/example/example.component.b2b.b2c.ts'],
      ['b2b', 'b2c'],
      'b2c'
    );

    expect(replacements[0].with).toEndWith('.b2c.ts');
  });

  it('should reject all combined with another theme', () => {
    expect(() =>
      discoverThemeReplacements([original, 'src/app/example/example.component.all.b2c.ts'], ['b2b', 'b2c'], 'b2c')
    ).toThrow('Override for "all" cannot be combined with theme names');
  });
});
