import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaContainerComponentPairOptionsSchema as Options } from './schema';

describe('Container Component Pair Schematic', () => {
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

  it('should create a container component pair', () => {
    const options = { ...defaultOptions };
    const tree = schematicRunner.runSchematic('ccp', options, appTree);
    expect(tree.files.filter(x => x.search('foo') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/components/foo/foo.component.ts",
  "/projects/bar/src/app/components/foo/foo.component.html",
  "/projects/bar/src/app/components/foo/foo.component.spec.ts",
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
import { FooComponent } from './components/foo/foo.component';
import { FooContainerComponent } from './containers/foo/foo.container';

@NgModule({
  declarations: [
    AppComponent,
    FooComponent,
    FooContainerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [FooContainerComponent]
})
export class AppModule { }
"
`);
  });

  it('should create a pair with style files if requested', () => {
    const options = { ...defaultOptions, styleFile: true };
    const tree = schematicRunner.runSchematic('ccp', options, appTree);
    expect(tree.files.filter(x => x.search('foo') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/components/foo/foo.component.scss",
  "/projects/bar/src/app/components/foo/foo.component.ts",
  "/projects/bar/src/app/components/foo/foo.component.html",
  "/projects/bar/src/app/components/foo/foo.component.spec.ts",
  "/projects/bar/src/app/containers/foo/foo.container.scss",
  "/projects/bar/src/app/containers/foo/foo.container.ts",
  "/projects/bar/src/app/containers/foo/foo.container.html",
  "/projects/bar/src/app/containers/foo/foo.container.spec.ts",
]
`);
    const containerSource = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(containerSource).toContain(`styleUrls: ['./foo.container.scss']`);
  });

  it('should find the closest module', () => {
    const options = { ...defaultOptions, name: 'bar/foo' };
    const fooModule = '/projects/bar/src/app/bar/bar.module.ts';
    appTree.create(
      fooModule,
      `import { NgModule } from '@angular/core';

      @NgModule({
        imports: [],
        declarations: []
      })
      export class FooModule { }`
    );

    const tree = schematicRunner.runSchematic('ccp', options, appTree);
    const fooModuleContent = tree.readContent(fooModule);
    expect(fooModuleContent).toMatchInlineSnapshot(`
"import { NgModule } from '@angular/core';
import { FooComponent } from './components/foo/foo.component';
import { FooContainerComponent } from './containers/foo/foo.container';

      @NgModule({
        imports: [],
        declarations: [FooComponent, FooContainerComponent],
        exports: [FooContainerComponent]
      })
      export class FooModule { }"
`);
  });

  it('should export the container', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ccp', options, appTree);
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/exports: \[FooContainerComponent\]/);
  });

  it('should create a pair in a sub-directory', () => {
    const options = { ...defaultOptions, path: 'projects/bar/src/app/a/b/c' };

    const tree = schematicRunner.runSchematic('ccp', options, appTree);
    const files = tree.files;
    const root = `/${options.path}/containers/foo/foo.container`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should use the prefix', () => {
    const options = { ...defaultOptions, prefix: 'pre' };

    const tree = schematicRunner.runSchematic('ccp', options, appTree);
    const containerContent = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(containerContent).toMatch(/selector: 'pre-foo-container'/);
    const containerTemplateContent = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.html');
    expect(containerTemplateContent).toMatch(/pre-foo/);
    const componentContent = tree.readContent('/projects/bar/src/app/components/foo/foo.component.ts');
    expect(componentContent).toMatch(/selector: 'pre-foo'/);
  });

  it('should handle a path in the name option', () => {
    const options = { ...defaultOptions, name: 'dir/test' };

    const tree = schematicRunner.runSchematic('ccp', options, appTree);
    const containerContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(containerContent).toMatch(
      /import { TestContainerComponent } from '\.\/dir\/containers\/test\/test.container'/
    );
    const componentContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(componentContent).toMatch(/import { TestComponent } from '\.\/dir\/components\/test\/test.component'/);
  });

  it('should create a correct test for the container', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ccp', options, appTree);
    const containerSpecContent = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.spec.ts');
    expect(containerSpecContent).toContain(`import { FooComponent } from '../../components/foo/foo.component'`);
    expect(containerSpecContent).toContain(`MockComponent(FooComponent)`);
  });
});
