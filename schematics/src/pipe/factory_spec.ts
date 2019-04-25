import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaPipeOptionsSchema as Options } from './schema';

describe('Pipe Schematic', () => {
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
    appTree.create(
      '/projects/bar/src/app/core/pipes.module.ts',
      `
import { NgModule } from '@angular/core';

const pipes = [];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
  providers: [...pipes],
})
export class PipesModule { }
`
    );
    appTree = schematicRunner.runSchematic(
      'module',
      { name: 'extensions/feature/feature', flat: true, project: 'bar' },
      appTree
    );
  });

  it('should create a pipe in core by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('pipe', options, appTree);
    const files = tree.files.filter(x => x.search('foo.pipe') >= 0);
    expect(files).toContain('/projects/bar/src/app/core/pipes/foo.pipe.spec.ts');
    expect(files).toContain('/projects/bar/src/app/core/pipes/foo.pipe.ts');
  });

  it('should register pipe in pipes module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('pipe', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/core/pipes.module.ts');
    expect(content).toContain('FooPipe');
    expect(content).toContain('./pipes/foo.pipe');
    expect(content).toMatchInlineSnapshot(`
"
import { NgModule } from '@angular/core';
import { FooPipe } from './pipes/foo.pipe';

const pipes = [];

@NgModule({
  declarations: [...pipes, FooPipe],
  exports: [...pipes, FooPipe],
  providers: [...pipes, FooPipe],
})
export class PipesModule { }
"
`);
  });

  it('should ignore folders in name', () => {
    const options = { ...defaultOptions, name: 'foobar/bar/foo' };

    const tree = schematicRunner.runSchematic('pipe', options, appTree);
    const files = tree.files.filter(x => x.search('foo.pipe') >= 0);
    expect(files).toContain('/projects/bar/src/app/core/pipes/foo.pipe.spec.ts');
    expect(files).toContain('/projects/bar/src/app/core/pipes/foo.pipe.ts');
  });

  it('should create a pipe in extension if supplied', () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = schematicRunner.runSchematic('pipe', options, appTree);
    const files = tree.files.filter(x => x.search('foo.pipe') >= 0);
    expect(files).toContain('/projects/bar/src/app/extensions/feature/pipes/foo.pipe.spec.ts');
    expect(files).toContain('/projects/bar/src/app/extensions/feature/pipes/foo.pipe.ts');
  });

  it('should create a pipe in extension if detected via input', () => {
    const options = { ...defaultOptions, name: 'extensions/feature/foo' };

    const tree = schematicRunner.runSchematic('pipe', options, appTree);
    const files = tree.files.filter(x => x.search('foo.pipe') >= 0);
    expect(files).toContain('/projects/bar/src/app/extensions/feature/pipes/foo.pipe.spec.ts');
    expect(files).toContain('/projects/bar/src/app/extensions/feature/pipes/foo.pipe.ts');
  });

  it('should register pipe in extension module', () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = schematicRunner.runSchematic('pipe', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/extensions/feature/feature.module.ts');
    expect(content).toContain('FooPipe');
  });
});
