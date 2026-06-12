import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { lastValueFrom } from 'rxjs';
import { PWAComponentOptionsSchema } from 'schemas/component/schema';
import { OverrideOptionsSchema as Options } from 'schemas/helpers/override/schema';

import { componentDecorator, createApplication, createModule, createSchematicRunner } from '../../utils/testHelper';

describe('override Schematic', () => {
  const schematicRunner = createSchematicRunner();

  let appTree: UnitTestTree;
  let runOverride: (options: Partial<Options>) => Promise<UnitTestTree>;

  beforeEach(async () => {
    const appTree$ = createApplication(schematicRunner).pipe(
      createModule(schematicRunner, { name: 'shared', project: undefined })
    );
    appTree = await lastValueFrom(appTree$);
    appTree = await schematicRunner.runSchematic('component', { project: 'bar', name: 'foo/dummy' }, appTree);
    appTree = await schematicRunner.runSchematic(
      'component',
      { project: 'bar', name: 'foo/foobar', styleFile: true } as PWAComponentOptionsSchema,
      appTree
    );
    appTree = await schematicRunner.runSchematic('service', { project: 'bar', name: 'services/dummy' }, appTree);
    appTree.create(
      '/src/app/core/routing/product.route.ts',
      `
    export function parse() {};
    `
    );

    runOverride = options => schematicRunner.runSchematic('override', { project: 'bar', ...options }, appTree);
  });

  it('should create files', () => {
    expect(appTree.files.filter(x => ['.component.', '.service.', '.route'].some(t => x.includes(t))).sort())
      .toMatchInlineSnapshot(`
      [
        "/src/app/app.component.html",
        "/src/app/app.component.scss",
        "/src/app/app.component.spec.ts",
        "/src/app/app.component.ts",
        "/src/app/core/routing/product.route.ts",
        "/src/app/core/services/dummy/dummy.service.spec.ts",
        "/src/app/core/services/dummy/dummy.service.ts",
        "/src/app/foo/dummy/dummy.component.html",
        "/src/app/foo/dummy/dummy.component.spec.ts",
        "/src/app/foo/dummy/dummy.component.ts",
        "/src/app/foo/foobar/foobar.component.html",
        "/src/app/foo/foobar/foobar.component.scss",
        "/src/app/foo/foobar/foobar.component.spec.ts",
        "/src/app/foo/foobar/foobar.component.ts",
      ]
    `);
  });

  it('should create a dummy component without style file', () => {
    const dummyComponent = appTree.readContent('/src/app/foo/dummy/dummy.component.ts');
    expect(componentDecorator(dummyComponent)).toMatchInlineSnapshot(
      `"@Component({ selector: 'ish-dummy', templateUrl: './dummy.component.html', })"`
    );
  });

  it('should create a foobar component with style file', () => {
    const foobarComponent = appTree.readContent('/src/app/foo/foobar/foobar.component.ts');
    expect(componentDecorator(foobarComponent)).toMatchInlineSnapshot(
      `"@Component({ selector: 'ish-foobar', templateUrl: './foobar.component.html', styleUrls: ['./foobar.component.scss'], })"`
    );
  });

  it('should throw an error if from is not specified', async done => {
    await runOverride({}).catch(err => {
      expect(err).toMatchInlineSnapshot(`[Error: Option (from) is required.]`);
      done();
    });
  });

  it('should throw an error if from is not pointing to an existing file', async done => {
    await runOverride({ from: 'src/app/foobar.ts' }).catch(err => {
      expect(err).toMatchInlineSnapshot(`[Error: Input does not point to an existing TypeScript file.]`);
      done();
    });
  });

  it('should throw an error if from is not pointing to an existing ts file', async done => {
    await runOverride({ from: 'foo/dummy/dummy.component.html' }).catch(err => {
      expect(err).toMatchInlineSnapshot(`[Error: Input does not point to an existing TypeScript file.]`);
      done();
    });
  });

  it('should throw an error if theme is not specified', async done => {
    await runOverride({ from: 'src/app/foo/dummy/dummy.component.ts' }).catch(err => {
      expect(err).toMatchInlineSnapshot(`[Error: Option (theme) is required.]`);
      done();
    });
  });

  it('should do nothing when no override was specified', async () => {
    const tree = await runOverride({ from: 'src/app/foo/dummy/dummy.component.ts', theme: 'all' });

    expect(tree.files.filter(x => x.includes('dummy.component'))).toMatchInlineSnapshot(`
      [
        "/src/app/foo/dummy/dummy.component.html",
        "/src/app/foo/dummy/dummy.component.spec.ts",
        "/src/app/foo/dummy/dummy.component.ts",
      ]
    `);

    expect(componentDecorator(appTree.readContent('/src/app/foo/dummy/dummy.component.ts'))).toMatchInlineSnapshot(
      `"@Component({ selector: 'ish-dummy', templateUrl: './dummy.component.html', })"`
    );
  });

  it('should throw an error if html override is specified on a non-component', async done => {
    await runOverride({ from: 'core/services/dummy/dummy.service.ts', theme: 'all', html: true }).catch(err => {
      expect(err).toMatchInlineSnapshot(`[Error: Template and Style overrides only work on components.]`);
      done();
    });
  });

  it('should throw an error if scss override is specified on a non-component', async done => {
    await runOverride({ from: 'core/services/dummy/dummy.service.ts', theme: 'all', scss: true }).catch(err => {
      expect(err).toMatchInlineSnapshot(`[Error: Template and Style overrides only work on components.]`);
      done();
    });
  });

  it('should override component html if specified', async () => {
    const tree = await runOverride({ from: 'foo/dummy/dummy.component.ts', theme: 'all', html: true });

    expect(tree.files.filter(x => x.includes('dummy.component'))).toMatchInlineSnapshot(`
      [
        "/src/app/foo/dummy/dummy.component.html",
        "/src/app/foo/dummy/dummy.component.spec.ts",
        "/src/app/foo/dummy/dummy.component.ts",
        "/src/app/foo/dummy/dummy.component.all.html",
      ]
    `);

    expect(appTree.readContent('/src/app/foo/dummy/dummy.component.all.html')).toMatchInlineSnapshot(`"OVERRIDE"`);
  });

  it('should override component scss for components with css if specified', async () => {
    const tree = await runOverride({ from: 'src/app/foo/foobar/foobar.component.ts', theme: 'all', scss: true });

    expect(tree.files.filter(x => x.includes('foobar.component'))).toMatchInlineSnapshot(`
      [
        "/src/app/foo/foobar/foobar.component.html",
        "/src/app/foo/foobar/foobar.component.scss",
        "/src/app/foo/foobar/foobar.component.spec.ts",
        "/src/app/foo/foobar/foobar.component.ts",
        "/src/app/foo/foobar/foobar.component.all.scss",
      ]
    `);

    expect(appTree.exists('/src/app/foo/foobar/foobar.component.all.scss')).toBeTrue();
  });

  it('should override component scss for components without it', async () => {
    const tree = await runOverride({ from: 'foo/dummy/dummy.component.ts', theme: 'all', scss: true });

    expect(tree.files.filter(x => x.includes('dummy.component'))).toMatchInlineSnapshot(`
      [
        "/src/app/foo/dummy/dummy.component.html",
        "/src/app/foo/dummy/dummy.component.spec.ts",
        "/src/app/foo/dummy/dummy.component.ts",
        "/src/app/foo/dummy/dummy.component.scss",
        "/src/app/foo/dummy/dummy.component.all.scss",
      ]
    `);

    expect(appTree.exists('/src/app/foo/dummy/dummy.component.all.scss')).toBeTrue();
    expect(appTree.exists('/src/app/foo/dummy/dummy.component.scss')).toBeTrue();
    const dummyComponent = appTree.readContent('/src/app/foo/dummy/dummy.component.ts');
    expect(componentDecorator(dummyComponent)).toMatchInlineSnapshot(
      `"@Component({ selector: 'ish-dummy', templateUrl: './dummy.component.html', styleUrls: ['./dummy.component.scss'], })"`
    );
  });

  it('should override component ts if specified', async () => {
    const tree = await runOverride({ from: 'foo/dummy/dummy.component.ts', theme: 'all', ts: true });

    expect(tree.files.filter(x => x.includes('dummy.component'))).toMatchInlineSnapshot(`
      [
        "/src/app/foo/dummy/dummy.component.html",
        "/src/app/foo/dummy/dummy.component.spec.ts",
        "/src/app/foo/dummy/dummy.component.ts",
        "/src/app/foo/dummy/dummy.component.all.ts",
      ]
    `);

    expect(appTree.readContent('/src/app/foo/dummy/dummy.component.all.ts')).toEqual(
      appTree.readContent('/src/app/foo/dummy/dummy.component.ts')
    );
  });

  it('should override everything on components with css if specified', async () => {
    const tree = await runOverride({
      from: 'src/app/foo/foobar/foobar.component.ts',
      theme: 'all',
      scss: true,
      html: true,
      ts: true,
    });

    expect(tree.files.filter(x => x.includes('foobar.component'))).toMatchInlineSnapshot(`
      [
        "/src/app/foo/foobar/foobar.component.html",
        "/src/app/foo/foobar/foobar.component.scss",
        "/src/app/foo/foobar/foobar.component.spec.ts",
        "/src/app/foo/foobar/foobar.component.ts",
        "/src/app/foo/foobar/foobar.component.all.html",
        "/src/app/foo/foobar/foobar.component.all.scss",
        "/src/app/foo/foobar/foobar.component.all.ts",
      ]
    `);

    expect(appTree.exists('/src/app/foo/foobar/foobar.component.all.scss')).toBeTrue();
    expect(appTree.readContent('/src/app/foo/foobar/foobar.component.all.html')).toMatchInlineSnapshot(`"OVERRIDE"`);
    expect(appTree.readContent('/src/app/foo/foobar/foobar.component.all.ts')).toEqual(
      appTree.readContent('/src/app/foo/foobar/foobar.component.ts')
    );
  });

  it('should override everything on components without css if specified', async () => {
    const tree = await runOverride({
      from: 'foo/dummy/dummy.component.ts',
      theme: 'all',
      scss: true,
      html: true,
      ts: true,
    });

    expect(tree.files.filter(x => x.includes('dummy.component'))).toMatchInlineSnapshot(`
      [
        "/src/app/foo/dummy/dummy.component.html",
        "/src/app/foo/dummy/dummy.component.spec.ts",
        "/src/app/foo/dummy/dummy.component.ts",
        "/src/app/foo/dummy/dummy.component.all.html",
        "/src/app/foo/dummy/dummy.component.scss",
        "/src/app/foo/dummy/dummy.component.all.scss",
        "/src/app/foo/dummy/dummy.component.all.ts",
      ]
    `);

    expect(appTree.exists('/src/app/foo/dummy/dummy.component.all.scss')).toBeTrue();
    expect(appTree.readContent('/src/app/foo/dummy/dummy.component.all.html')).toMatchInlineSnapshot(`"OVERRIDE"`);
    expect(appTree.readContent('/src/app/foo/dummy/dummy.component.all.ts')).toEqual(
      appTree.readContent('/src/app/foo/dummy/dummy.component.ts')
    );
  });

  it('should override service ts if requested', async () => {
    const tree = await runOverride({
      from: 'src/app/core/services/dummy/dummy.service.ts',
      theme: 'all',
      ts: true,
    });

    expect(tree.files.filter(x => x.includes('dummy.service'))).toMatchInlineSnapshot(`
      [
        "/src/app/core/services/dummy/dummy.service.spec.ts",
        "/src/app/core/services/dummy/dummy.service.ts",
        "/src/app/core/services/dummy/dummy.service.all.ts",
      ]
    `);
  });

  it('should override any ts if requested', async () => {
    const tree = await runOverride({
      from: 'core/routing/product.route.ts',
      theme: 'all',
      ts: true,
    });

    expect(tree.files.filter(x => x.includes('product.route'))).toMatchInlineSnapshot(`
      [
        "/src/app/core/routing/product.route.ts",
        "/src/app/core/routing/product.route.all.ts",
      ]
    `);
  });

  it('should override file if path is windows-styled', async () => {
    const tree = await runOverride({
      from: 'core\\routing\\product.route.ts',
      theme: 'all',
      ts: true,
    });

    expect(tree.files.filter(x => x.includes('product.route'))).toMatchInlineSnapshot(`
      [
        "/src/app/core/routing/product.route.ts",
        "/src/app/core/routing/product.route.all.ts",
      ]
    `);
  });
});
