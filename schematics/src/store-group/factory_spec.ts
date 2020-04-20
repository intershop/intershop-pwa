import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

import { PwaStoreGroupOptionsSchema as Options } from './schema';

describe('Store Group Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).toPromise();
    appTree.create(
      '/projects/bar/src/app/core/store/core-store.module.ts',
      `import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

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
  });

  it('should create a store-group in core store by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('store-group', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/core/store/foo/foo-store.ts",
  "/projects/bar/src/app/core/store/foo/foo-store.module.ts",
]
`);
  });

  it('should register a store group in core store by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('store-group', options, appTree).toPromise();
    const storeModuleContent = tree.readContent('/projects/bar/src/app/core/store/core-store.module.ts');
    expect(storeModuleContent).toContain('import { FooStoreModule }');
  });
});
