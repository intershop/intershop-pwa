import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaServiceOptionsSchema as Options } from './schema';

describe('Service Schematic', () => {
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

  it('should create a service in core by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('service', options, appTree);
    const files = tree.files.filter(x => x.search('foo.service') >= 0);
    expect(files).toContain('/projects/bar/src/app/core/services/foo/foo.service.spec.ts');
    expect(files).toContain('/projects/bar/src/app/core/services/foo/foo.service.ts');

    expect(tree.readContent('/projects/bar/src/app/core/services/foo/foo.service.ts')).toContain('../api/api.service');
  });

  it('should ignore folders in name', () => {
    const options = { ...defaultOptions, name: 'foobar/bar/foo' };

    const tree = schematicRunner.runSchematic('service', options, appTree);
    const files = tree.files.filter(x => x.search('foo.service') >= 0);
    expect(files).toContain('/projects/bar/src/app/core/services/foo/foo.service.spec.ts');
    expect(files).toContain('/projects/bar/src/app/core/services/foo/foo.service.ts');
  });

  it('should create a service in extension if supplied', () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = schematicRunner.runSchematic('service', options, appTree);
    const files = tree.files.filter(x => x.search('foo.service') >= 0);
    expect(files).toContain('/projects/bar/src/app/extensions/feature/services/foo/foo.service.spec.ts');
    expect(files).toContain('/projects/bar/src/app/extensions/feature/services/foo/foo.service.ts');

    expect(tree.readContent('/projects/bar/src/app/extensions/feature/services/foo/foo.service.ts')).toContain(
      'ish-core/services/api/api.service'
    );
  });

  it('should create a service in extension if implied by name', () => {
    const options = { ...defaultOptions, name: 'src/app/extensions/feature/services/foo' };

    const tree = schematicRunner.runSchematic('service', options, appTree);
    const files = tree.files.filter(x => x.search('foo.service') >= 0);
    expect(files).toContain('/projects/bar/src/app/extensions/feature/services/foo/foo.service.spec.ts');
    expect(files).toContain('/projects/bar/src/app/extensions/feature/services/foo/foo.service.ts');

    expect(tree.readContent('/projects/bar/src/app/extensions/feature/services/foo/foo.service.ts')).toContain(
      'ish-core/services/api/api.service'
    );
  });

  it('service should be tree-shakeable', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('service', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/core/services/foo/foo.service.ts');
    expect(content).toMatch(/providedIn: 'root'/);
  });
});
