import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaComponentOptionsSchema as Options } from './schema';

describe('Component Schematic', () => {
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

  it('should create a component', () => {
    const options = { ...defaultOptions };
    const tree = schematicRunner.runSchematic('component', options, appTree);
    expect(tree.files.filter(x => x.search('foo.component') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/components/foo/foo.component.ts",
  "/projects/bar/src/app/components/foo/foo.component.html",
  "/projects/bar/src/app/components/foo/foo.component.spec.ts",
]
`);
    const moduleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(moduleContent).toMatchInlineSnapshot(`
"import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FooComponent } from './components/foo/foo.component';

@NgModule({
  declarations: [
    AppComponent,
    FooComponent
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

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const tsContent = tree.readContent('/projects/bar/src/app/components/foo/foo.component.ts');
    expect(tsContent).toContain('changeDetection: ChangeDetectionStrategy.OnPush');
  });

  it('should create a flat component if requested', () => {
    const options = { ...defaultOptions, flat: true };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    expect(tree.files.filter(x => x.search('foo.component') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/foo.component.ts",
  "/projects/bar/src/app/foo.component.html",
  "/projects/bar/src/app/foo.component.spec.ts",
]
`);
    const tsContent = tree.readContent('/projects/bar/src/app/foo.component.ts');
    expect(tsContent).not.toBeEmpty();

    const moduleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import { FooComponent } from '.\/foo.component'/);
  });

  it('should remove component from name', () => {
    const options = { ...defaultOptions, name: 'test-component' };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const tsContent = tree.readContent('/projects/bar/src/app/components/test/test.component.ts');
    expect(tsContent).not.toBeEmpty();
  });

  it('should create a component with style file if requested', () => {
    const options = { ...defaultOptions, styleFile: true };
    const tree = schematicRunner.runSchematic('component', options, appTree);
    expect(tree.files.filter(x => x.search('foo.component') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/components/foo/foo.component.scss",
  "/projects/bar/src/app/components/foo/foo.component.ts",
  "/projects/bar/src/app/components/foo/foo.component.html",
  "/projects/bar/src/app/components/foo/foo.component.spec.ts",
]
`);
    const componentSource = tree.readContent('/projects/bar/src/app/components/foo/foo.component.ts');
    expect(componentSource).toContain(`styleUrls: ['./foo.component.scss']`);
  });

  it('should find the closest module', () => {
    const options = { ...defaultOptions };
    const fooModule = '/projects/bar/src/app/components/foo/foo.module.ts';
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

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const fooModuleContent = tree.readContent(fooModule);
    expect(fooModuleContent).toMatch(/import { FooComponent } from '.\/foo.component'/);
  });

  it('should export the component if requested', () => {
    const options = { ...defaultOptions, export: true };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/exports: \[FooComponent\]/);
  });

  it('should set the entry component if requested', () => {
    const options = { ...defaultOptions, entryComponent: true };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/entryComponents: \[FooComponent\]/);
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app' };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const appModule = tree.readContent('/projects/bar/src/app/app.module.ts');

    expect(appModule).toMatch(/import { FooComponent } from '.\/components\/foo\/foo.component'/);
  });

  it('should fail if specified module does not exist', () => {
    const options = { ...defaultOptions, module: '/projects/bar/src/app.moduleXXX.ts' };
    expect(() => schematicRunner.runSchematic('component', options, appTree)).toThrowErrorMatchingInlineSnapshot(`
"Specified module '/projects/bar/src/app.moduleXXX.ts' does not exist.
Looked in the following directories:
    /projects/bar/src/app/components/projects/bar/src/app.moduleXXX.ts
    /projects/bar/src/app/components/projects/bar/src
    /projects/bar/src/app/components/projects/bar
    /projects/bar/src/app/components/projects
    /projects/bar/src/app/components/foo
    /projects/bar/src/app/components
    /projects/bar/src/app
    /projects/bar/src
    /projects/bar
    /projects"
`);
  });

  it('should handle upper case paths', () => {
    const pathOption = 'projects/bar/src/app/SOME/UPPER/DIR';
    const options = { ...defaultOptions, path: pathOption };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    let files = tree.files;
    let root = `/${pathOption}/components/foo/foo.component`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);

    const options2 = { ...options, name: 'BAR' };
    const tree2 = schematicRunner.runSchematic('component', options2, tree);
    files = tree2.files;
    root = `/${pathOption}/components/bar/bar.component`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should create a component in a sub-directory', () => {
    const options = { ...defaultOptions, path: 'projects/bar/src/app/a/b/c' };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const files = tree.files.filter(x => x.search('foo.component') >= 0);
    const root = `/${options.path}/components/foo/foo.component`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should use the prefix', () => {
    const options = { ...defaultOptions, prefix: 'pre' };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/components/foo/foo.component.ts');
    expect(content).toMatch(/selector: 'pre-foo'/);
  });

  it('should use the default project prefix if none is passed', () => {
    const options = { ...defaultOptions, prefix: undefined };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/components/foo/foo.component.ts');
    expect(content).toMatch(/selector: 'ish-foo'/);
  });

  it('should use the supplied prefix if it is ""', () => {
    const options = { ...defaultOptions, prefix: '' };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/components/foo/foo.component.ts');
    expect(content).toMatch(/selector: 'foo'/);
  });

  it('should handle a path in the name option', () => {
    const options = { ...defaultOptions, name: 'dir/test' };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const content = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(content).toMatch(/import { TestComponent } from '\.\/dir\/components\/test\/test.component'/);
  });

  it('should handle a path in the name and module options', () => {
    appTree = schematicRunner.runSchematic('module', { name: 'other/test', project: 'bar', flat: true }, appTree);

    const options = { ...defaultOptions, name: 'other/test-component', export: true };
    appTree = schematicRunner.runSchematic('component', options, appTree);

    const content = appTree.readContent('/projects/bar/src/app/other/test.module.ts');
    expect(content).toMatch(/import { TestComponent } from '.\/components\/test\/test.component'/);
  });

  it('should create the right selector with a path in the name', () => {
    const options = { ...defaultOptions, name: 'sub/test' };
    appTree = schematicRunner.runSchematic('component', options, appTree);
    const content = appTree.readContent('/projects/bar/src/app/sub/components/test/test.component.ts');
    expect(content).toMatch(/selector: 'ish-test'/);
  });

  it('should respect the sourceRoot value', () => {
    const config = JSON.parse(appTree.readContent('/angular.json'));
    config.projects.bar.sourceRoot = 'projects/bar/custom';
    appTree.overwrite('/angular.json', JSON.stringify(config, undefined, 2));

    // should fail without a module in that dir
    expect(() => schematicRunner.runSchematic('component', defaultOptions, appTree)).toThrow();

    // move the module
    appTree.rename('/projects/bar/src/app/app.module.ts', '/projects/bar/custom/app/app.module.ts');
    appTree = schematicRunner.runSchematic('component', defaultOptions, appTree);
    expect(appTree.files).toContain('/projects/bar/custom/app/components/foo/foo.component.ts');
  });
});
