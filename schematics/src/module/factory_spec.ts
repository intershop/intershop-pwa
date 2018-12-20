import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaModuleOptionsSchema as Options } from './schema';

// tslint:disable:max-line-length
describe('Module Schematic', () => {
  const schematicRunner = new SchematicTestRunner('intershop-schematics', require.resolve('../collection.json'));
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', {
      name: 'workspace',
      newProjectRoot: 'projects',
      version: '6.0.0',
    } as WorkspaceOptions);
    appTree = schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'application',
      {
        name: 'bar',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: 'css',
        skipTests: false,
        skipPackageJson: false,
        prefix: 'ish',
      } as ApplicationOptions,
      appTree
    );
  });

  it('should create a module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('module', options, appTree);
    expect(tree.files).toInclude('/projects/bar/src/app/foo/foo.module.ts');
  });

  it('should create a module in a sub folder', () => {
    const options = { ...defaultOptions, name: 'foo/bar/foobar' };

    const tree = schematicRunner.runSchematic('module', options, appTree);
    expect(tree.files).toInclude('/projects/bar/src/app/foo/bar/foobar/foobar.module.ts');
  });

  it('should create a flat module', () => {
    const options = { ...defaultOptions, flat: true };

    const tree = schematicRunner.runSchematic('module', options, appTree);
    expect(tree.files).toInclude('/projects/bar/src/app/foo.module.ts');
  });

  it('should dasherize a name', () => {
    const options = { ...defaultOptions, name: 'TwoWord' };

    const tree = schematicRunner.runSchematic('module', options, appTree);
    expect(tree.files).toContain('/projects/bar/src/app/two-word/two-word.module.ts');
  });

  it('should respect the sourceRoot value', () => {
    const config = JSON.parse(appTree.readContent('/angular.json'));
    config.projects.bar.sourceRoot = 'projects/bar/custom';
    appTree.overwrite('/angular.json', JSON.stringify(config, undefined, 2));
    appTree = schematicRunner.runSchematic('module', defaultOptions, appTree);
    expect(appTree.files).toContain('/projects/bar/custom/app/foo/foo.module.ts');
  });
});
