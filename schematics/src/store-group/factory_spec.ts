import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { copyFileFromPWA, createApplication, createSchematicRunner } from '../utils/testHelper';

import { PWAStoreGroupOptionsSchema as Options } from './schema';

describe('Store Group Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(
        copyFileFromPWA('src/app/core/state-management.module.ts'),
        copyFileFromPWA('src/app/core/store/core/core-store.ts')
      )
      .toPromise();
  });

  it('should create a store-group in core store by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('store-group', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/src/app/core/store/foo/foo-store.module.ts",
        "/src/app/core/store/foo/foo-store.ts",
      ]
    `);
  });

  it('should register a store group module in state management by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('store-group', options, appTree).toPromise();
    const storeModuleContent = tree.readContent('/src/app/core/state-management.module.ts');
    expect(storeModuleContent).toContain('import { FooStoreModule }');
  });
});
