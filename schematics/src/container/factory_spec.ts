import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaContainerOptionsSchema as Options } from './schema';

describe('Container Schematic', () => {
  const schematicRunner = new SchematicTestRunner('intershop-schematics', require.resolve('../collection.json'));
  const defaultOptions: Options = {
    name: 'foo',
    styleFile: false,
    styleext: 'scss',
    module: undefined,
    export: false,
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

  it('should create a container', () => {
    const options = { ...defaultOptions };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    expect(tree.files.filter(x => x.search('foo.container') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/containers/foo/foo.container.ts",
  "/projects/bar/src/app/containers/foo/foo.container.html",
  "/projects/bar/src/app/containers/foo/foo.container.spec.ts",
]
`);
    const moduleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(moduleContent).toMatchInlineSnapshot(`
"import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FooContainerComponent } from './containers/foo/foo.container';

@NgModule({
  declarations: [
    AppComponent,
    FooContainerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
"
`);
  });

  it('should set change detection to OnPush by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const tsContent = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(tsContent).toContain('changeDetection: ChangeDetectionStrategy.OnPush');
  });

  it('should create a flat container if requested', () => {
    const options = { ...defaultOptions, flat: true };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    expect(tree.files.filter(x => x.search('foo.container') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/foo.container.ts",
  "/projects/bar/src/app/foo.container.html",
  "/projects/bar/src/app/foo.container.spec.ts",
]
`);
    const tsContent = tree.readContent('/projects/bar/src/app/foo.container.ts');
    expect(tsContent).not.toBeEmpty();

    const moduleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import { FooContainerComponent } from '.\/foo.container'/);
  });

  it('should remove container from name', () => {
    const options = { ...defaultOptions, name: 'test-container' };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const tsContent = tree.readContent('/projects/bar/src/app/containers/test/test.container.ts');
    expect(tsContent).not.toBeEmpty();
  });

  it('should create a container with style file if requested', () => {
    const options = { ...defaultOptions, styleFile: true };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    expect(tree.files.filter(x => x.search('foo.container') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/containers/foo/foo.container.scss",
  "/projects/bar/src/app/containers/foo/foo.container.ts",
  "/projects/bar/src/app/containers/foo/foo.container.html",
  "/projects/bar/src/app/containers/foo/foo.container.spec.ts",
]
`);
    const containerSource = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(containerSource).toContain(`styleUrls: ['./foo.container.scss']`);
  });

  it('should reference a selector in template if requested', () => {
    const options = { ...defaultOptions, referenceSelector: 'ish-dummy-page', referenceComponent: 'dummy-page' };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const containerTemplate = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.html');
    expect(containerTemplate).toContain('ish-dummy-page');
    const containerTest = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.spec.ts');
    expect(containerTest).toContain('DummyPageComponent');
    expect(containerTest).toContain('MockComponent');
  });

  it('should find the closest module', () => {
    const options = { ...defaultOptions };
    const fooModule = '/projects/bar/src/app/containers/foo/foo.module.ts';
    appTree.create(
      fooModule,
      `
      import { NgModule } from '@angular/core';

      @NgModule({
        imports: [],
        declarations: []
      })
      export class FooModule { }
    `
    );

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const fooModuleContent = tree.readContent(fooModule);
    expect(fooModuleContent).toMatch(/import { FooContainerComponent } from '.\/foo.container'/);
  });

  it('should export the container if requested', () => {
    const options = { ...defaultOptions, export: true };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/exports: \[FooContainerComponent\]/);
  });

  it('should set the entry container if requested', () => {
    const options = { ...defaultOptions, entryComponent: true };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/entryComponents: \[FooContainerComponent\]/);
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app' };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const appModule = tree.readContent('/projects/bar/src/app/app.module.ts');

    expect(appModule).toMatch(/import { FooContainerComponent } from '.\/containers\/foo\/foo.container'/);
  });

  it('should fail if specified module does not exist', () => {
    const options = { ...defaultOptions, module: '/projects/bar/src/app.moduleXXX.ts' };
    expect(() => schematicRunner.runSchematic('container', options, appTree)).toThrowErrorMatchingInlineSnapshot(`
"Specified module '/projects/bar/src/app.moduleXXX.ts' does not exist.
Looked in the following directories:
    /projects/bar/src/app/containers/projects/bar/src/app.moduleXXX.ts
    /projects/bar/src/app/containers/projects/bar/src
    /projects/bar/src/app/containers/projects/bar
    /projects/bar/src/app/containers/projects
    /projects/bar/src/app/containers/foo
    /projects/bar/src/app/containers
    /projects/bar/src/app
    /projects/bar/src
    /projects/bar
    /projects"
`);
  });

  it('should handle upper case paths', () => {
    const pathOption = 'projects/bar/src/app/SOME/UPPER/DIR';
    const options = { ...defaultOptions, path: pathOption };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    let files = tree.files;
    let root = `/${pathOption}/containers/foo/foo.container`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);

    const options2 = { ...options, name: 'BAR' };
    const tree2 = schematicRunner.runSchematic('container', options2, tree);
    files = tree2.files;
    root = `/${pathOption}/containers/bar/bar.container`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should create a container in a sub-directory', () => {
    const options = { ...defaultOptions, path: 'projects/bar/src/app/a/b/c' };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const files = tree.files;
    const root = `/${options.path}/containers/foo/foo.container`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should use the prefix', () => {
    const options = { ...defaultOptions, prefix: 'pre' };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(content).toMatch(/selector: 'pre-foo-container'/);
  });

  it('should use the default project prefix if none is passed', () => {
    const options = { ...defaultOptions, prefix: undefined };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(content).toMatch(/selector: 'ish-foo-container'/);
  });

  it('should use the supplied prefix if it is ""', () => {
    const options = { ...defaultOptions, prefix: '' };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(content).toMatch(/selector: 'foo-container'/);
  });

  it('should handle a path in the name option', () => {
    const options = { ...defaultOptions, name: 'dir/test' };

    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(content).toMatch(/import { TestContainerComponent } from '\.\/dir\/containers\/test\/test.container'/);
  });

  it('should handle a path in the name and module options', () => {
    appTree = schematicRunner.runSchematic('module', { name: 'other/test', project: 'bar', flat: true }, appTree);

    const options = { ...defaultOptions, name: 'other/test-container', export: true };
    appTree = schematicRunner.runSchematic('container', options, appTree);

    const content = appTree.readContent('/projects/bar/src/app/other/test.module.ts');
    expect(content).toMatch(/import { TestContainerComponent } from '.\/containers\/test\/test.container'/);
  });

  it('should create the right selector with a path in the name', () => {
    const options = { ...defaultOptions, name: 'sub/test' };
    appTree = schematicRunner.runSchematic('container', options, appTree);
    const content = appTree.readContent('/projects/bar/src/app/sub/containers/test/test.container.ts');
    expect(content).toMatch(/selector: 'ish-test-container'/);
  });

  it('should respect the sourceRoot value', () => {
    const config = JSON.parse(appTree.readContent('/angular.json'));
    config.projects.bar.sourceRoot = 'projects/bar/custom';
    appTree.overwrite('/angular.json', JSON.stringify(config, undefined, 2));

    // should fail without a module in that dir
    expect(() => schematicRunner.runSchematic('container', defaultOptions, appTree)).toThrow();

    // move the module
    appTree.rename('/projects/bar/src/app/app.module.ts', '/projects/bar/custom/app/app.module.ts');
    appTree = schematicRunner.runSchematic('container', defaultOptions, appTree);
    expect(appTree.files).toContain('/projects/bar/custom/app/containers/foo/foo.container.ts');
  });
});
