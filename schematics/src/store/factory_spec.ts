import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { mergeMap } from 'rxjs/operators';

import {
  copyFileFromPWA,
  createAppLastRoutingModule,
  createApplication,
  createModule,
  createSchematicRunner,
} from '../utils/testHelper';

import { determineStoreLocation } from './factory';
import { PWAStoreOptionsSchema as Options } from './schema';

describe('Store Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(
        createModule(schematicRunner, { name: 'shared' }),
        createAppLastRoutingModule(schematicRunner),
        mergeMap(tree => schematicRunner.runSchematicAsync('extension', { name: 'feature', project: 'bar' }, tree)),
        copyFileFromPWA('src/app/core/store/core/core-store.module.ts'),
        copyFileFromPWA('src/app/core/store/core/core-store.ts'),
        copyFileFromPWA('src/app/core/state-management.module.ts'),
        mergeMap(tree => schematicRunner.runSchematicAsync('store-group', { ...defaultOptions, name: 'bar' }, tree))
      )
      .toPromise();
  });

  it('should create a store in core store by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo') >= 0).sort();
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/src/app/core/store/core/foo/foo.actions.ts",
        "/src/app/core/store/core/foo/foo.effects.spec.ts",
        "/src/app/core/store/core/foo/foo.effects.ts",
        "/src/app/core/store/core/foo/foo.reducer.ts",
        "/src/app/core/store/core/foo/foo.selectors.spec.ts",
        "/src/app/core/store/core/foo/foo.selectors.ts",
        "/src/app/core/store/core/foo/index.ts",
      ]
    `);
  });

  it('should register a store in core store by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const storeContent = tree.readContent('/src/app/core/store/core/core-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent('/src/app/core/store/core/core-store.module.ts');
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should create a store in core feature store if requested', async () => {
    const options = { ...defaultOptions, feature: 'bar' };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo') >= 0).sort();
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/src/app/core/store/bar/foo/foo.actions.ts",
        "/src/app/core/store/bar/foo/foo.effects.spec.ts",
        "/src/app/core/store/bar/foo/foo.effects.ts",
        "/src/app/core/store/bar/foo/foo.reducer.ts",
        "/src/app/core/store/bar/foo/foo.selectors.spec.ts",
        "/src/app/core/store/bar/foo/foo.selectors.ts",
        "/src/app/core/store/bar/foo/index.ts",
      ]
    `);
  });

  it('should register in feature store', async () => {
    const options = { ...defaultOptions, feature: 'bar' };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const storeContent = tree.readContent('/src/app/core/store/bar/bar-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent('/src/app/core/store/bar/bar-store.module.ts');
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should create a store in extension if requested', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo') >= 0).sort();
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/src/app/extensions/feature/store/foo/foo.actions.ts",
        "/src/app/extensions/feature/store/foo/foo.effects.spec.ts",
        "/src/app/extensions/feature/store/foo/foo.effects.ts",
        "/src/app/extensions/feature/store/foo/foo.reducer.ts",
        "/src/app/extensions/feature/store/foo/foo.selectors.spec.ts",
        "/src/app/extensions/feature/store/foo/foo.selectors.ts",
        "/src/app/extensions/feature/store/foo/index.ts",
      ]
    `);
  });

  it('should register in extension store', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('store', options, appTree).toPromise();
    const storeContent = tree.readContent('/src/app/extensions/feature/store/feature-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent('/src/app/extensions/feature/store/feature-store.module.ts');
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should throw if both feature and extension are supplied', done => {
    const options = { ...defaultOptions, extension: 'feature', feature: 'bar' };

    schematicRunner.runSchematicAsync('store', options, appTree).subscribe(fail, err => {
      expect(err).toMatchInlineSnapshot(`[Error: cannot add feature store in extension]`);
      done();
    });
  });

  describe('determineStoreLocation', () => {
    it('should handle simple stores', async () => {
      const config = {
        extension: undefined,
        feature: 'core',
        name: 'foobar',
        parent: 'core',
        parentStorePath: 'src/app/core/store/core/core',
        path: 'src/app/core/store/core/',
        project: 'bar',
      };

      expect(await determineStoreLocation(appTree, { ...defaultOptions, name: 'foobar' })).toEqual(config);
      expect(await determineStoreLocation(appTree, { ...defaultOptions, name: 'core/store/core/foobar' })).toEqual(
        config
      );
    });

    it('should handle feature stores', async () => {
      const config = {
        extension: undefined,
        feature: 'bar',
        name: 'foobar',
        parent: 'bar',
        parentStorePath: 'src/app/core/store/bar/bar',
        path: 'src/app/core/store/bar/',
        project: 'bar',
      };

      expect(await determineStoreLocation(appTree, { ...defaultOptions, name: 'foobar', feature: 'bar' })).toEqual(
        config
      );
      expect(await determineStoreLocation(appTree, { ...defaultOptions, name: 'bar/foobar' })).toEqual(config);
      expect(await determineStoreLocation(appTree, { ...defaultOptions, name: 'core/store/bar/foobar' })).toEqual(
        config
      );
    });

    it('should handle extension stores', async () => {
      const config = {
        extension: 'bar',
        feature: undefined,
        name: 'foobar',
        parent: 'bar',
        parentStorePath: 'src/app/extensions/bar/store/bar',
        path: 'src/app/extensions/bar/store/',
        project: 'bar',
      };

      expect(await determineStoreLocation(appTree, { ...defaultOptions, name: 'foobar', extension: 'bar' })).toEqual(
        config
      );
      expect(await determineStoreLocation(appTree, { ...defaultOptions, name: 'extensions/bar/foobar' })).toEqual(
        config
      );
    });

    it('should throw if feature equals store name', async () => {
      let error: Error;

      try {
        await determineStoreLocation(appTree, { ...defaultOptions, feature: defaultOptions.name });
      } catch (err) {
        error = err;
      }

      expect(error?.message).toMatchInlineSnapshot(`"name of feature and store cannot be equal"`);
    });

    it('should throw if extension equals store name', async () => {
      let error: Error;

      try {
        await determineStoreLocation(appTree, { ...defaultOptions, extension: defaultOptions.name });
      } catch (err) {
        error = err;
      }

      expect(error?.message).toMatchInlineSnapshot(`"name of extension and store cannot be equal"`);
    });
  });
});
