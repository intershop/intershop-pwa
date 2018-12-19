import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaStoreOptionsSchema as Options } from './schema';

describe('Store Schematic', () => {
  const schematicRunner = new SchematicTestRunner('intershop-schematics', require.resolve('../collection.json'));
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(done => {
    schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
      } as WorkspaceOptions)
      .toPromise()
      .then(workspace =>
        schematicRunner
          .runExternalSchematicAsync(
            '@schematics/angular',
            'application',
            {
              name: 'bar',
              inlineStyle: false,
              inlineTemplate: false,
              routing: true,
              style: 'css',
              skipTests: false,
              skipPackageJson: false,
              prefix: 'ish',
            } as ApplicationOptions,
            workspace
          )
          .toPromise()
          .then(application =>
            schematicRunner
              .runSchematicAsync('module', { name: 'shared', project: 'bar' }, application)
              .toPromise()
              .then(tree => {
                schematicRunner
                  .runExternalSchematicAsync(
                    '@schematics/angular',
                    'module',
                    {
                      name: 'pages/app-not-found-routing',
                      flat: true,
                      project: 'bar',
                      module: 'app.module',
                    },
                    tree
                  )
                  .toPromise()
                  .then(extensionTree =>
                    schematicRunner
                      .runSchematicAsync('extension', { name: 'feature', project: 'bar' }, extensionTree)
                      .toPromise()
                      .then(completeTree => {
                        appTree = completeTree;
                        appTree.create(
                          '/projects/bar/src/app/core/store/core-store.module.ts',
                          `import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { RouterEffects } from 'ngrx-router';

import { CoreState } from './core-store';
import { CountriesEffects } from './countries/countries.effects';
import { countriesReducer } from './countries/countries.reducer';

export const coreReducers: ActionReducerMap<CoreState> = {countries: countriesReducer};

export const coreEffects = [
  CountriesEffects,
];

@NgModule({
  imports: [
    EffectsModule.forRoot(coreEffects),
    StoreModule.forRoot(coreReducers),
  ],
})
export class CoreStoreModule {}
`
                        );
                        appTree.create(
                          '/projects/bar/src/app/core/store/core-store.ts',
                          `import { Selector } from '@ngrx/store';

import { CountriesState } from './countries/countries.reducer';

export interface CoreState {
  countries: CountriesState;
}

export const getCoreState: Selector<CoreState, CoreState> = state => state;
`
                        );
                        appTree.create(
                          '/projects/bar/src/app/core/store/bar/bar-store.module.ts',
                          `import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { BarState } from './bar-store';

export const barReducers: ActionReducerMap<BarState> = {};

export const barEffects = [];

@NgModule({
  imports: [
    EffectsModule.forRoot(barEffects),
    StoreModule.forRoot(barReducers),
  ],
})
export class BarStoreModule {}
`
                        );
                        appTree.create(
                          '/projects/bar/src/app/core/store/bar/bar-store.ts',
                          `import { Selector } from '@ngrx/store';

export interface BarState {}
`
                        );
                        done();
                      })
                  );
              })
          )
      );
  });

  it('should create a store in core store by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/core/store/foo/foo.actions.ts",
  "/projects/bar/src/app/core/store/foo/foo.effects.ts",
  "/projects/bar/src/app/core/store/foo/foo.effects.spec.ts",
  "/projects/bar/src/app/core/store/foo/foo.reducer.ts",
  "/projects/bar/src/app/core/store/foo/foo.selectors.ts",
  "/projects/bar/src/app/core/store/foo/foo.selectors.spec.ts",
  "/projects/bar/src/app/core/store/foo/index.ts",
]
`);
  });

  it('should register a store in core store by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const storeContent = tree.readContent('/projects/bar/src/app/core/store/core-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent('/projects/bar/src/app/core/store/core-store.module.ts');
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should create a store in core feature store if requested', () => {
    const options = { ...defaultOptions, feature: 'bar' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/core/store/bar/foo/foo.actions.ts",
  "/projects/bar/src/app/core/store/bar/foo/foo.effects.ts",
  "/projects/bar/src/app/core/store/bar/foo/foo.effects.spec.ts",
  "/projects/bar/src/app/core/store/bar/foo/foo.reducer.ts",
  "/projects/bar/src/app/core/store/bar/foo/foo.selectors.ts",
  "/projects/bar/src/app/core/store/bar/foo/foo.selectors.spec.ts",
  "/projects/bar/src/app/core/store/bar/foo/index.ts",
]
`);
  });

  it('should register in feature store', () => {
    const options = { ...defaultOptions, feature: 'bar' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const storeContent = tree.readContent('/projects/bar/src/app/core/store/bar/bar-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent('/projects/bar/src/app/core/store/bar/bar-store.module.ts');
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should create a store in extension if requested', () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/extensions/feature/store/foo/foo.actions.ts",
  "/projects/bar/src/app/extensions/feature/store/foo/foo.effects.ts",
  "/projects/bar/src/app/extensions/feature/store/foo/foo.effects.spec.ts",
  "/projects/bar/src/app/extensions/feature/store/foo/foo.reducer.ts",
  "/projects/bar/src/app/extensions/feature/store/foo/foo.selectors.ts",
  "/projects/bar/src/app/extensions/feature/store/foo/foo.selectors.spec.ts",
  "/projects/bar/src/app/extensions/feature/store/foo/index.ts",
]
`);
  });

  it('should register in extension store', () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const storeContent = tree.readContent('/projects/bar/src/app/extensions/feature/store/feature-store.ts');
    expect(storeContent).toContain('import { FooState }');
    expect(storeContent).toContain('foo: FooState');
    const storeModuleContent = tree.readContent(
      '/projects/bar/src/app/extensions/feature/store/feature-store.module.ts'
    );
    expect(storeModuleContent).toContain('import { fooReducer }');
    expect(storeModuleContent).toContain('foo: fooReducer');
    expect(storeModuleContent).toContain('import { FooEffects }');
    expect(storeModuleContent).toContain('FooEffects');
  });

  it('should throw if both feature and extension are supplied', () => {
    const options = { ...defaultOptions, extension: 'feature', feature: 'bar' };

    expect(() => schematicRunner.runSchematic('store', options, appTree)).toThrowErrorMatchingInlineSnapshot(
      `"cannot add feature store in extension"`
    );
  });
});
