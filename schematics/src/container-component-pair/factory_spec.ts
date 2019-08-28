import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

import { PwaContainerComponentPairOptionsSchema as Options } from './schema';

describe('Container Component Pair Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).toPromise();
  });

  it('should create a container component pair', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner.runSchematicAsync('ccp', options, appTree).toPromise();
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

      import { AppRoutingModule } from './app-routing.module';
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
          BrowserModule,
          AppRoutingModule
        ],
        providers: [],
        bootstrap: [AppComponent],
        exports: [FooContainerComponent]
      })
      export class AppModule { }
      "
    `);
  });

  it('should create a pair with style files if requested', async () => {
    const options = { ...defaultOptions, styleFile: true };
    const tree = await schematicRunner.runSchematicAsync('ccp', options, appTree).toPromise();
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

  it('should find the closest module', async () => {
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

    const tree = await schematicRunner.runSchematicAsync('ccp', options, appTree).toPromise();
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

  it('should export the container', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('ccp', options, appTree).toPromise();
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatch(/exports: \[FooContainerComponent\]/);
  });

  it('should create a pair in a sub-directory', async () => {
    const options = { ...defaultOptions, path: 'projects/bar/src/app/a/b/c' };

    const tree = await schematicRunner.runSchematicAsync('ccp', options, appTree).toPromise();
    const files = tree.files;
    const root = `/${options.path}/containers/foo/foo.container`;
    expect(files).toIncludeAllMembers([`${root}.html`, `${root}.spec.ts`, `${root}.ts`]);
  });

  it('should use the prefix', async () => {
    const options = { ...defaultOptions, prefix: 'pre' };

    const tree = await schematicRunner.runSchematicAsync('ccp', options, appTree).toPromise();
    const containerContent = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.ts');
    expect(containerContent).toMatch(/selector: 'pre-foo-container'/);
    const containerTemplateContent = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.html');
    expect(containerTemplateContent).toMatch(/pre-foo/);
    const componentContent = tree.readContent('/projects/bar/src/app/components/foo/foo.component.ts');
    expect(componentContent).toMatch(/selector: 'pre-foo'/);
  });

  it('should handle a path in the name option', async () => {
    const options = { ...defaultOptions, name: 'dir/test' };

    const tree = await schematicRunner.runSchematicAsync('ccp', options, appTree).toPromise();
    const containerContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(containerContent).toMatch(
      /import { TestContainerComponent } from '\.\/dir\/containers\/test\/test.container'/
    );
    const componentContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(componentContent).toMatch(/import { TestComponent } from '\.\/dir\/components\/test\/test.component'/);
  });

  it('should create a correct test for the container', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('ccp', options, appTree).toPromise();
    const containerSpecContent = tree.readContent('/projects/bar/src/app/containers/foo/foo.container.spec.ts');
    expect(containerSpecContent).toContain(`import { FooComponent } from '../../components/foo/foo.component'`);
    expect(containerSpecContent).toContain(`MockComponent(FooComponent)`);
  });
});
