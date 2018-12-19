import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaModelOptionsSchema as Options } from './schema';

// tslint:disable:max-line-length
describe('Model Schematic', () => {
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

  it('should create a model in core by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('model', options, appTree);
    expect(tree.files.filter(x => x.search('foo') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/core/models/foo/foo.helper.ts",
  "/projects/bar/src/app/core/models/foo/foo.helper.spec.ts",
  "/projects/bar/src/app/core/models/foo/foo.interface.ts",
  "/projects/bar/src/app/core/models/foo/foo.mapper.ts",
  "/projects/bar/src/app/core/models/foo/foo.mapper.spec.ts",
  "/projects/bar/src/app/core/models/foo/foo.model.ts",
]
`);
  });

  it('should create a simple model in core if requested', () => {
    const options = { ...defaultOptions, simple: true };

    const tree = schematicRunner.runSchematic('model', options, appTree);
    expect(tree.files.filter(x => x.search('foo') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/core/models/foo/foo.model.ts",
]
`);
  });

  it('should create a model in extension if requested', () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = schematicRunner.runSchematic('model', options, appTree);
    expect(tree.files.filter(x => x.search('foo') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/extensions/feature/models/foo/foo.helper.ts",
  "/projects/bar/src/app/extensions/feature/models/foo/foo.helper.spec.ts",
  "/projects/bar/src/app/extensions/feature/models/foo/foo.interface.ts",
  "/projects/bar/src/app/extensions/feature/models/foo/foo.mapper.ts",
  "/projects/bar/src/app/extensions/feature/models/foo/foo.mapper.spec.ts",
  "/projects/bar/src/app/extensions/feature/models/foo/foo.model.ts",
]
`);
  });
});
