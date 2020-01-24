import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

import { PwaPageOptionsSchema as Options } from './schema';

describe('Page Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).toPromise();

    appTree.create(
      '/projects/bar/src/app/pages/app-routing.module.ts',
      `
      import { NgModule } from '@angular/core';

      const routes = [
        { path: 'some', component: Dummy },
        { path: 'other', component: Dummy },
        { path: 'routes', component: Dummy },
      ]

      @NgModule({
        imports: [RouterModule.forRoot(routes)],
        declarations: []
      })
      export class AppRoutingModule { }
    `
    );
    appTree.create(
      '/projects/bar/src/app/extensions/feature/pages/feature-routing.module.ts',
      `
      import { NgModule } from '@angular/core';

      const featureRoutes = [{ path: 'some', component: Dummy }]

      @NgModule({
        imports: [RouterModule.forChild(routes)],
        declarations: []
      })
      export class FeatureRoutingModule { }
    `
    );
    appTree.create(
      '/projects/bar/src/app/extensions/feature2/pages/feature2-routing.module.ts',
      `
      import { NgModule } from '@angular/core';

      const feature2Routes = []

      @NgModule({
        imports: [RouterModule.forChild(routes)],
        declarations: []
      })
      export class Feature2RoutingModule { }
    `
    );
  });

  it('should create a page in root by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo-page') >= 0);
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/projects/bar/src/app/pages/foo/foo-page.module.ts",
        "/projects/bar/src/app/pages/foo/foo-page.component.ts",
        "/projects/bar/src/app/pages/foo/foo-page.component.html",
        "/projects/bar/src/app/pages/foo/foo-page.component.spec.ts",
      ]
    `);
    expect(tree.readContent('/projects/bar/src/app/pages/foo/foo-page.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { RouterModule, Routes } from '@angular/router';

      import { SharedModule } from '../../shared/shared.module';
      import { FooPageComponent } from './foo-page.component';

      const fooPageRoutes: Routes = [{ path: '', component: FooPageComponent }];

      @NgModule({
        imports: [RouterModule.forChild(fooPageRoutes), SharedModule],
        declarations: [FooPageComponent],
      })
      export class FooPageModule { }
      "
    `);
    expect(tree.readContent('/projects/bar/src/app/pages/foo/foo-page.component.html')).toMatchInlineSnapshot(`
      "<p>
        foo-page works!
      </p>
      "
    `);
  });

  it('should create a correct test for the component', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
    const componentSpecContent = tree.readContent('/projects/bar/src/app/pages/foo/foo-page.component.spec.ts');
    expect(componentSpecContent).toContain(`import { FooPageComponent } from './foo-page.component'`);
  });

  it('should register route in app routing module by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
    const appRoutingModule = tree.readContent('/projects/bar/src/app/pages/app-routing.module.ts');
    expect(appRoutingModule).toContain(`path: 'foo'`);
    expect(appRoutingModule).toContain('foo-page.module');
    expect(appRoutingModule).toContain('FooPageModule');
  });

  it('should create a page in extension if supplied', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo-page') >= 0);
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.module.ts",
        "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.component.ts",
        "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.component.html",
        "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.component.spec.ts",
      ]
    `);
    expect(tree.readContent('/projects/bar/src/app/extensions/feature/pages/foo/foo-page.module.ts'))
      .toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { RouterModule, Routes } from '@angular/router';

      import { FeatureModule } from '../../feature.module';
      import { FooPageComponent } from './foo-page.component';

      const fooPageRoutes: Routes = [{ path: '', component: FooPageComponent }];

      @NgModule({
        imports: [RouterModule.forChild(fooPageRoutes), FeatureModule],
        declarations: [FooPageComponent],
      })
      export class FooPageModule { }
      "
    `);
    expect(tree.readContent('/projects/bar/src/app/extensions/feature/pages/foo/foo-page.component.html'))
      .toMatchInlineSnapshot(`
      "<p>
        foo-page works!
      </p>
      "
    `);
  });

  it('should create a page in extension if implied by name', async () => {
    const options = { ...defaultOptions, name: 'extensions/feature/pages/foo' };

    const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo-page') >= 0);
    expect(files).toMatchInlineSnapshot(`
      Array [
        "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.module.ts",
        "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.component.ts",
        "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.component.html",
        "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.component.spec.ts",
      ]
    `);
  });

  it('should register route in feature routing module', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
    const appRoutingModule = tree.readContent(
      '/projects/bar/src/app/extensions/feature/pages/feature-routing.module.ts'
    );
    expect(appRoutingModule).toContain(`path: 'foo'`);
    expect(appRoutingModule).toContain('foo-page.module');
    expect(appRoutingModule).toContain('FooPageModule');
  });

  it('should register route in feature routing module when it is the first', async () => {
    const options = { ...defaultOptions, extension: 'feature2' };

    const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
    const appRoutingModule = tree.readContent(
      '/projects/bar/src/app/extensions/feature2/pages/feature2-routing.module.ts'
    );
    expect(appRoutingModule).toContain(`path: 'foo'`);
    expect(appRoutingModule).toContain('foo-page.module');
    expect(appRoutingModule).toContain('FooPageModule');
  });

  it('should register route in page routing module when subpaging is detected', async () => {
    const options = { ...defaultOptions };

    appTree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
    const tree = await schematicRunner.runSchematicAsync('page', { ...options, name: 'foo-bar' }, appTree).toPromise();
    const appRoutingModule = tree.readContent('/projects/bar/src/app/pages/app-routing.module.ts');
    expect(appRoutingModule).toContain(`path: 'foo'`);
    expect(appRoutingModule).toContain('foo-page.module');
    expect(appRoutingModule).toContain('FooPageModule');
    expect(appRoutingModule).not.toContain('FooBar');

    const fooRoutingModule = tree.readContent('/projects/bar/src/app/pages/foo/foo-page.module.ts');
    expect(fooRoutingModule).toContain(`path: 'bar'`);
    expect(fooRoutingModule).toContain('foo-bar-page.module');
    expect(fooRoutingModule).toContain('FooBarPageModule');
  });
});
