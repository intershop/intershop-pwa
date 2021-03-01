import { noop } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

import { PWAComponentOptionsSchema as Options } from './schema';

describe('Component Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    styleFile: false,
    module: undefined,
    export: false,
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).toPromise();
  });

  it('should create a component', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    expect(tree.files.filter(x => x.search('foo.component') >= 0)).toMatchInlineSnapshot(`
      Array [
        "/src/app/foo/foo.component.html",
        "/src/app/foo/foo.component.spec.ts",
        "/src/app/foo/foo.component.ts",
      ]
    `);
    const moduleContent = tree.readContent('/src/app/app.module.ts');
    expect(moduleContent).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { BrowserModule } from '@angular/platform-browser';

      import { AppRoutingModule } from './app-routing.module';
      import { AppComponent } from './app.component';
      import { FooComponent } from './foo/foo.component';

      @NgModule({
        declarations: [
          AppComponent,
          FooComponent
        ],
        imports: [
          BrowserModule,
          AppRoutingModule
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
      "
    `);
  });

  it('should set change detection to OnPush by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const tsContent = tree.readContent('/src/app/foo/foo.component.ts');
    expect(tsContent).toContain('changeDetection: ChangeDetectionStrategy.OnPush');
  });

  it('should create a flat component if requested', async () => {
    const options = { ...defaultOptions, flat: true };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    expect(tree.files.filter(x => x.search('foo.component') >= 0)).toMatchInlineSnapshot(`
      Array [
        "/src/app/foo.component.html",
        "/src/app/foo.component.spec.ts",
        "/src/app/foo.component.ts",
      ]
    `);
    const tsContent = tree.readContent('/src/app/foo.component.ts');
    expect(tsContent).not.toBeEmpty();

    const moduleContent = tree.readContent('/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import { FooComponent } from '.\/foo.component'/);
  });

  it('should remove component from name', async () => {
    const options = { ...defaultOptions, name: 'test-component' };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const tsContent = tree.readContent('/src/app/test/test.component.ts');
    expect(tsContent).not.toBeEmpty();
  });

  it('should create a component with style file if requested', async () => {
    const options = { ...defaultOptions, styleFile: true };
    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    expect(tree.files.filter(x => x.search('foo.component') >= 0)).toMatchInlineSnapshot(`
      Array [
        "/src/app/foo/foo.component.html",
        "/src/app/foo/foo.component.scss",
        "/src/app/foo/foo.component.spec.ts",
        "/src/app/foo/foo.component.ts",
      ]
    `);
    const componentSource = tree.readContent('/src/app/foo/foo.component.ts');
    expect(componentSource).toContain(`styleUrls: ['./foo.component.scss']`);
  });

  it('should find the closest module', async () => {
    const options = { ...defaultOptions };
    const fooModule = '/src/app/foo/foo.module.ts';
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

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const fooModuleContent = tree.readContent(fooModule);
    expect(fooModuleContent).toMatch(/import { FooComponent } from '.\/foo.component'/);
  });

  it('should export the component if requested', async () => {
    const options = { ...defaultOptions, export: true };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const appModuleContent = tree.readContent('/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/exports: \[FooComponent\]/);
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app' };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const appModule = tree.readContent('/src/app/app.module.ts');

    expect(appModule).toMatch(/import { FooComponent } from '.\/foo\/foo.component'/);
  });

  it('should fail if specified module does not exist', done => {
    const options = { ...defaultOptions, module: '/src/app.moduleXXX.ts' };
    schematicRunner.runSchematicAsync('component', options, appTree).subscribe(noop, err => {
      expect(err).toMatchInlineSnapshot(`
        [Error: Specified module '/src/app.moduleXXX.ts' does not exist.
        Looked in the following directories:
            /src/app/src/app.moduleXXX.ts
            /src/app/src
            /src/app/foo
            /src/app
            /src]
      `);
      done();
    });
  });

  it('should handle upper case paths', async () => {
    const pathOption = 'src/app/SOME/UPPER/DIR';
    const options = { ...defaultOptions, path: pathOption };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    let files = tree.files;
    let root = `/${pathOption}/foo/foo.component`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);

    const options2 = { ...options, name: 'BAR' };
    const tree2 = await schematicRunner.runSchematicAsync('component', options2, tree).toPromise();
    files = tree2.files;
    root = `/${pathOption}/bar/bar.component`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should create a component in a sub-directory', async () => {
    const options = { ...defaultOptions, path: 'src/app/a/b/c' };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.component') >= 0);
    const root = `/${options.path}/foo/foo.component`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should use the prefix', async () => {
    const options = { ...defaultOptions, prefix: 'pre' };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const content = tree.readContent('/src/app/foo/foo.component.ts');
    expect(content).toMatch(/selector: 'pre-foo'/);
  });

  it('should use the default project prefix if none is passed', async () => {
    const options = { ...defaultOptions, prefix: undefined };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const content = tree.readContent('/src/app/foo/foo.component.ts');
    expect(content).toMatch(/selector: 'ish-foo'/);
  });

  it('should use the supplied prefix if it is ""', async () => {
    const options = { ...defaultOptions, prefix: '' };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const content = tree.readContent('/src/app/foo/foo.component.ts');
    expect(content).toMatch(/selector: 'foo'/);
  });

  it('should handle a path in the name option', async () => {
    const options = { ...defaultOptions, name: 'dir/test' };

    const tree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const content = tree.readContent('/src/app/app.module.ts');
    expect(content).toMatch(/import { TestComponent } from '\.\/dir\/test\/test.component'/);
  });

  it('should handle a path in the name and module options', async () => {
    appTree = await schematicRunner
      .runSchematicAsync('module', { name: 'other/test', project: 'bar', flat: true }, appTree)
      .toPromise();

    const options = { ...defaultOptions, name: 'other/test-component', export: true };
    appTree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();

    const content = appTree.readContent('/src/app/other/test.module.ts');
    expect(content).toMatch(/import { TestComponent } from '.\/test\/test.component'/);
  });

  it('should create the right selector with a path in the name', async () => {
    const options = { ...defaultOptions, name: 'sub/test' };
    appTree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const content = appTree.readContent('/src/app/sub/test/test.component.ts');
    expect(content).toMatch(/selector: 'ish-test'/);
  });

  it('should create include selector prefix in name but not duplicate in selector if requested', async () => {
    const options = { ...defaultOptions, name: 'sub/ish-test' };
    appTree = await schematicRunner.runSchematicAsync('component', options, appTree).toPromise();
    const content = appTree.readContent('/src/app/sub/ish-test/ish-test.component.ts');
    expect(content).toMatch(/selector: 'ish-test'/);
  });

  it('should respect the sourceRoot value', async () => {
    const config = JSON.parse(appTree.readContent('/angular.json'));
    config.projects.bar.sourceRoot = 'projects/bar/custom';
    appTree.overwrite('/angular.json', JSON.stringify(config, undefined, 2));

    let error: Error;
    try {
      await schematicRunner.runSchematicAsync('component', defaultOptions, appTree).toPromise();
    } catch (err) {
      error = err;
    }
    expect(error?.message).toMatchInlineSnapshot(
      `"Could not find an NgModule. Use the skip-import option to skip importing in NgModule."`
    );

    appTree.rename('/src/app/app.module.ts', '/projects/bar/custom/app/app.module.ts');
    appTree = await schematicRunner.runSchematicAsync('component', defaultOptions, appTree).toPromise();

    expect(appTree.files).toContain('/projects/bar/custom/app/foo/foo.component.ts');
  });
});
