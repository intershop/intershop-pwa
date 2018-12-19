import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaStoreGroupOptionsSchema as Options } from './schema';

describe('Store Group Schematic', () => {
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
            done();
          })
      );
  });

  it('should create a store-group in core store by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store-group', options, appTree);
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/core/store/foo/foo-store.ts",
  "/projects/bar/src/app/core/store/foo/foo-store.module.ts",
]
`);
  });

  it('should register a store group in core store by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store-group', options, appTree);
    const storeModuleContent = tree.readContent('/projects/bar/src/app/core/store/core-store.module.ts');
    expect(storeModuleContent).toContain('import { FooStoreModule }');
  });
});
