import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

import { PWAModuleOptionsSchema as Options } from './schema';

describe('Module Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).toPromise();
  });

  it('should create a module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('module', options, appTree).toPromise();
    expect(tree.files).toInclude('/src/app/foo/foo.module.ts');
  });

  it('should create a module in a sub folder', async () => {
    const options = { ...defaultOptions, name: 'foo/bar/foobar' };

    const tree = await schematicRunner.runSchematicAsync('module', options, appTree).toPromise();
    expect(tree.files).toInclude('/src/app/foo/bar/foobar/foobar.module.ts');
  });

  it('should create a flat module', async () => {
    const options = { ...defaultOptions, flat: true };

    const tree = await schematicRunner.runSchematicAsync('module', options, appTree).toPromise();
    expect(tree.files).toInclude('/src/app/foo.module.ts');
  });

  it('should dasherize a name', async () => {
    const options = { ...defaultOptions, name: 'TwoWord' };

    const tree = await schematicRunner.runSchematicAsync('module', options, appTree).toPromise();
    expect(tree.files).toContain('/src/app/two-word/two-word.module.ts');
  });

  it('should respect the sourceRoot value', async () => {
    const config = JSON.parse(appTree.readContent('/angular.json'));
    config.projects.bar.sourceRoot = 'projects/bar/custom';
    appTree.overwrite('/angular.json', JSON.stringify(config, undefined, 2));
    appTree = await schematicRunner.runSchematicAsync('module', defaultOptions, appTree).toPromise();
    expect(appTree.files).toContain('/projects/bar/custom/app/foo/foo.module.ts');
  });
});
