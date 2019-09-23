import { noop } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

import { PwaContainerOptionsSchema as Options } from './schema';

describe('Container Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    styleFile: false,
    styleext: 'scss',
    module: undefined,
    export: false,
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).toPromise();
  });

  it('should create a container', async () => {
    const options = { ...defaultOptions };
    const tree = await await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
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

      import { AppRoutingModule } from './app-routing.module';
      import { AppComponent } from './app.component';
      import { FooContainerComponent } from './containers/foo/foo.container';

      @NgModule({
        declarations: [
          AppComponent,
          FooContainerComponent
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

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const tsContent = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(tsContent).toContain('changeDetection: ChangeDetectionStrategy.OnPush');
  });

  it('should create a flat container if requested', async () => {
    const options = { ...defaultOptions, flat: true };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
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

  it('should remove container from name', async () => {
    const options = { ...defaultOptions, name: 'test-container' };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const tsContent = tree.readContent('/projects/bar/src/app/containers/test/test.container.ts');
    expect(tsContent).not.toBeEmpty();
  });

  it('should create a container with style file if requested', async () => {
    const options = { ...defaultOptions, styleFile: true };
    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
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

  it('should reference a selector in template if requested', async () => {
    const options = { ...defaultOptions, referenceSelector: 'ish-dummy-page', referenceComponent: 'dummy-page' };
    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const containerTemplate = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.html');
    expect(containerTemplate).toContain('ish-dummy-page');
    const containerTest = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.spec.ts');
    expect(containerTest).toContain('DummyPageComponent');
    expect(containerTest).toContain('MockComponent');
  });

  it('should find the closest module', async () => {
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

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const fooModuleContent = tree.readContent(fooModule);
    expect(fooModuleContent).toMatch(/import { FooContainerComponent } from '.\/foo.container'/);
  });

  it('should export the container if requested', async () => {
    const options = { ...defaultOptions, export: true };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/exports: \[FooContainerComponent\]/);
  });

  it('should set the entry container if requested', async () => {
    const options = { ...defaultOptions, entryComponent: true };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/entryComponents: \[FooContainerComponent\]/);
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app' };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const appModule = tree.readContent('/projects/bar/src/app/app.module.ts');

    expect(appModule).toMatch(/import { FooContainerComponent } from '.\/containers\/foo\/foo.container'/);
  });

  it('should fail if specified module does not exist', done => {
    const options = { ...defaultOptions, module: '/projects/bar/src/app.moduleXXX.ts' };
    schematicRunner.runSchematicAsync('container', options, appTree).subscribe(noop, err => {
      expect(err).toMatchInlineSnapshot(`
        [Error: Specified module '/projects/bar/src/app.moduleXXX.ts' does not exist.
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
            /projects]
      `);
      done();
    });
  });

  it('should handle upper case paths', async () => {
    const pathOption = 'projects/bar/src/app/SOME/UPPER/DIR';
    const options = { ...defaultOptions, path: pathOption };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    let files = tree.files;
    let root = `/${pathOption}/containers/foo/foo.container`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);

    const options2 = { ...options, name: 'BAR' };
    const tree2 = await schematicRunner.runSchematicAsync('container', options2, tree).toPromise();
    files = tree2.files;
    root = `/${pathOption}/containers/bar/bar.container`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should create a container in a sub-directory', async () => {
    const options = { ...defaultOptions, path: 'projects/bar/src/app/a/b/c' };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const files = tree.files;
    const root = `/${options.path}/containers/foo/foo.container`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should use the prefix', async () => {
    const options = { ...defaultOptions, prefix: 'pre' };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const content = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(content).toMatch(/selector: 'pre-foo-container'/);
  });

  it('should use the default project prefix if none is passed', async () => {
    const options = { ...defaultOptions, prefix: undefined };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const content = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(content).toMatch(/selector: 'ish-foo-container'/);
  });

  it('should use the supplied prefix if it is ""', async () => {
    const options = { ...defaultOptions, prefix: '' };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const content = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(content).toMatch(/selector: 'foo-container'/);
  });

  it('should handle a path in the name option', async () => {
    const options = { ...defaultOptions, name: 'dir/test' };

    const tree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const content = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(content).toMatch(/import { TestContainerComponent } from '\.\/dir\/containers\/test\/test.container'/);
  });

  it('should handle a path in the name and module options', async () => {
    appTree = await schematicRunner
      .runSchematicAsync('module', { name: 'other/test', project: 'bar', flat: true }, appTree)
      .toPromise();

    const options = { ...defaultOptions, name: 'other/test-container', export: true };
    appTree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();

    const content = appTree.readContent('/projects/bar/src/app/other/test.module.ts');
    expect(content).toMatch(/import { TestContainerComponent } from '.\/containers\/test\/test.container'/);
  });

  it('should create the right selector with a path in the name', async () => {
    const options = { ...defaultOptions, name: 'sub/test' };
    appTree = await schematicRunner.runSchematicAsync('container', options, appTree).toPromise();
    const content = appTree.readContent('/projects/bar/src/app/sub/containers/test/test.container.ts');
    expect(content).toMatch(/selector: 'ish-test-container'/);
  });

  it('should respect the sourceRoot value', async () => {
    const config = JSON.parse(appTree.readContent('/angular.json'));
    config.projects.bar.sourceRoot = 'projects/bar/custom';
    appTree.overwrite('/angular.json', JSON.stringify(config, undefined, 2));

    // should fail without a module in that dir
    schematicRunner.runSchematicAsync('container', defaultOptions, appTree).subscribe(noop, err => {
      expect(err).toMatchInlineSnapshot(
        `[Error: Could not find an NgModule. Use the skip-import option to skip importing in NgModule.]`
      );
    });

    // move the module
    appTree.rename('/projects/bar/src/app/app.module.ts', '/projects/bar/custom/app/app.module.ts');
    appTree = await schematicRunner.runSchematicAsync('container', defaultOptions, appTree).toPromise();
    expect(appTree.files).toContain('/projects/bar/custom/app/containers/foo/foo.container.ts');
  });
});
