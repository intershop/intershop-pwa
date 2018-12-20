import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaPageOptionsSchema as Options } from './schema';

describe('Page Schematic', () => {
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

  it('should create a page in root by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('page', options, appTree);
    const files = tree.files.filter(x => x.search('foo-page') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/pages/foo/foo-page.module.ts",
  "/projects/bar/src/app/pages/foo/foo-page.container.ts",
  "/projects/bar/src/app/pages/foo/foo-page.container.html",
  "/projects/bar/src/app/pages/foo/foo-page.container.spec.ts",
  "/projects/bar/src/app/pages/foo/components/foo-page/foo-page.component.ts",
  "/projects/bar/src/app/pages/foo/components/foo-page/foo-page.component.html",
  "/projects/bar/src/app/pages/foo/components/foo-page/foo-page.component.spec.ts",
]
`);
    expect(tree.readContent('/projects/bar/src/app/pages/foo/foo-page.module.ts')).toMatchInlineSnapshot(`
"import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { FooPageComponent } from './components/foo-page/foo-page.component';
import { FooPageContainerComponent } from './foo-page.container';

const fooPageRoutes: Routes = [{ path: '', component: FooPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(fooPageRoutes), SharedModule],
  declarations: [FooPageComponent, FooPageContainerComponent],
})
export class FooPageModule { }
"
`);
    expect(tree.readContent('/projects/bar/src/app/pages/foo/foo-page.container.html')).toMatchInlineSnapshot(`
"<ish-foo-page></ish-foo-page>
"
`);
  });

  it('should register route in app routing module by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('page', options, appTree);
    const appRoutingModule = tree.readContent('/projects/bar/src/app/pages/app-routing.module.ts');
    expect(appRoutingModule).toContain(`path: 'foo'`);
    expect(appRoutingModule).toContain('foo-page.module#FooPageModule');
  });

  it('should create a page in extension if supplied', () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = schematicRunner.runSchematic('page', options, appTree);
    const files = tree.files.filter(x => x.search('foo-page') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.module.ts",
  "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.container.ts",
  "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.container.html",
  "/projects/bar/src/app/extensions/feature/pages/foo/foo-page.container.spec.ts",
  "/projects/bar/src/app/extensions/feature/pages/foo/components/foo-page/foo-page.component.ts",
  "/projects/bar/src/app/extensions/feature/pages/foo/components/foo-page/foo-page.component.html",
  "/projects/bar/src/app/extensions/feature/pages/foo/components/foo-page/foo-page.component.spec.ts",
]
`);
    expect(tree.readContent('/projects/bar/src/app/extensions/feature/pages/foo/foo-page.module.ts'))
      .toMatchInlineSnapshot(`
"import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureModule } from '../../feature.module';
import { FooPageComponent } from './components/foo-page/foo-page.component';
import { FooPageContainerComponent } from './foo-page.container';

const fooPageRoutes: Routes = [{ path: '', component: FooPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(fooPageRoutes), FeatureModule],
  declarations: [FooPageComponent, FooPageContainerComponent],
})
export class FooPageModule { }
"
`);
    expect(tree.readContent('/projects/bar/src/app/extensions/feature/pages/foo/foo-page.container.html'))
      .toMatchInlineSnapshot(`
"<ish-foo-page></ish-foo-page>
"
`);
  });

  it('should create a page in extension if implied by name', () => {
    const options = { ...defaultOptions, name: 'extenstions/feature/pages/foo' };

    const tree = schematicRunner.runSchematic('page', options, appTree);
    const files = tree.files.filter(x => x.search('foo-page') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/pages/foo/foo-page.module.ts",
  "/projects/bar/src/app/pages/foo/foo-page.container.ts",
  "/projects/bar/src/app/pages/foo/foo-page.container.html",
  "/projects/bar/src/app/pages/foo/foo-page.container.spec.ts",
  "/projects/bar/src/app/pages/foo/components/foo-page/foo-page.component.ts",
  "/projects/bar/src/app/pages/foo/components/foo-page/foo-page.component.html",
  "/projects/bar/src/app/pages/foo/components/foo-page/foo-page.component.spec.ts",
]
`);
  });

  it('should register route in feature routing module', () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = schematicRunner.runSchematic('page', options, appTree);
    const appRoutingModule = tree.readContent(
      '/projects/bar/src/app/extensions/feature/pages/feature-routing.module.ts'
    );
    expect(appRoutingModule).toContain(`path: 'foo'`);
    expect(appRoutingModule).toContain('foo-page.module#FooPageModule');
  });

  it('should register route in feature routing module when it is the first', () => {
    const options = { ...defaultOptions, extension: 'feature2' };

    const tree = schematicRunner.runSchematic('page', options, appTree);
    const appRoutingModule = tree.readContent(
      '/projects/bar/src/app/extensions/feature2/pages/feature2-routing.module.ts'
    );
    expect(appRoutingModule).toContain(`path: 'foo'`);
    expect(appRoutingModule).toContain('foo-page.module#FooPageModule');
  });

  it('should register route in page routing module when subpaging is detected', () => {
    const options = { ...defaultOptions };

    appTree = schematicRunner.runSchematic('page', options, appTree);
    const tree = schematicRunner.runSchematic('page', { ...options, name: 'foo-bar' }, appTree);
    const appRoutingModule = tree.readContent('/projects/bar/src/app/pages/app-routing.module.ts');
    expect(appRoutingModule).toContain(`path: 'foo'`);
    expect(appRoutingModule).toContain('foo-page.module#FooPageModule');
    expect(appRoutingModule).not.toContain('FooBar');

    const fooRoutingModule = tree.readContent('/projects/bar/src/app/pages/foo/foo-page.module.ts');
    expect(fooRoutingModule).toContain(`path: 'bar'`);
    expect(fooRoutingModule).toContain('foo-bar-page.module#FooBarPageModule');
  });
});
