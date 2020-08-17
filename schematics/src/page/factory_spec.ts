import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

import { PWAPageOptionsSchema as Options } from './schema';

describe('Page Schematic', () => {
  const schematicRunner = createSchematicRunner();

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).toPromise();

    appTree.create(
      '/src/app/pages/app-routing.module.ts',
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
      '/src/app/extensions/feature/pages/feature-routing.module.ts',
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
      '/src/app/extensions/feature2/pages/feature2-routing.module.ts',
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

  describe('with lazy === true', () => {
    const defaultOptions: Options = {
      name: 'foo',
      project: 'bar',
    };
    it('should create a page in root by default', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();
      const files = tree.files.filter(x => x.search('foo-page') >= 0);

      expect(files).toIncludeAllMembers([
        '/src/app/pages/foo/foo-page.component.ts',
        '/src/app/pages/foo/foo-page.component.html',
        '/src/app/pages/foo/foo-page.component.spec.ts',
      ]);
    });

    it('should create a page module with page component declaration', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();

      expect(tree.exists('/src/app/pages/foo/foo-page.module.ts')).toBeTrue();
      const pageModule = tree.readContent('/src/app/pages/foo/foo-page.module.ts');
      expect(pageModule).toContain("import { FooPageComponent } from './foo-page.component';");
      expect(pageModule).toContain("{ path: '', component: FooPageComponent }");
      expect(pageModule).toContain('declarations: [FooPageComponent]');
      expect(pageModule).toContain('export class FooPageModule');
      expect(pageModule).toMatch(/imports: .*SharedModule/);

      expect(tree.readContent('/src/app/pages/foo/foo-page.component.html')).toContain('foo-page works!');
    });

    it('should create a correct test for the component', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();
      const componentSpecContent = tree.readContent('/src/app/pages/foo/foo-page.component.spec.ts');
      expect(componentSpecContent).toContain(`import { FooPageComponent } from './foo-page.component'`);
    });

    it('should lazily register route in app routing module by default', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();
      const appRoutingModule = tree.readContent('/src/app/pages/app-routing.module.ts');
      expect(appRoutingModule).toContain(`path: 'foo'`);
      expect(appRoutingModule).toContain('foo-page.module');
      expect(appRoutingModule).toContain('FooPageModule');
    });

    it('should create a page in extension if supplied', async () => {
      const options = { ...defaultOptions, extension: 'feature' };

      const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
      const files = tree.files.filter(x => x.search('foo-page') >= 0);
      expect(files).toIncludeAllMembers([
        '/src/app/extensions/feature/pages/foo/foo-page.module.ts',
        '/src/app/extensions/feature/pages/foo/foo-page.component.ts',
        '/src/app/extensions/feature/pages/foo/foo-page.component.html',
        '/src/app/extensions/feature/pages/foo/foo-page.component.spec.ts',
      ]);

      const pageModule = tree.readContent('/src/app/extensions/feature/pages/foo/foo-page.module.ts');
      expect(pageModule).toContain("import { FooPageComponent } from './foo-page.component';");
      expect(pageModule).toContain("{ path: '', component: FooPageComponent }");
      expect(pageModule).toContain('declarations: [FooPageComponent]');
      expect(pageModule).toContain('export class FooPageModule');
      expect(pageModule).toMatch(/imports: .*FeatureModule/);

      expect(tree.readContent('/src/app/extensions/feature/pages/foo/foo-page.component.html')).toContain(
        'foo-page works!'
      );
    });

    it('should create a page in extension if implied by name', async () => {
      const options = { ...defaultOptions, name: 'extensions/feature/pages/foo' };

      const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
      const files = tree.files.filter(x => x.search('foo-page') >= 0);
      expect(files).toIncludeAllMembers([
        '/src/app/extensions/feature/pages/foo/foo-page.module.ts',
        '/src/app/extensions/feature/pages/foo/foo-page.component.ts',
        '/src/app/extensions/feature/pages/foo/foo-page.component.html',
        '/src/app/extensions/feature/pages/foo/foo-page.component.spec.ts',
      ]);
    });

    it('should lazily register route in feature routing module', async () => {
      const options = { ...defaultOptions, extension: 'feature' };

      const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
      const appRoutingModule = tree.readContent('/src/app/extensions/feature/pages/feature-routing.module.ts');
      expect(appRoutingModule).toContain(`path: 'foo'`);
      expect(appRoutingModule).toContain('foo-page.module');
      expect(appRoutingModule).toContain('FooPageModule');
    });

    it('should lazily register route in feature routing module when it is the first', async () => {
      const options = { ...defaultOptions, extension: 'feature2' };

      const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
      const appRoutingModule = tree.readContent('/src/app/extensions/feature2/pages/feature2-routing.module.ts');
      expect(appRoutingModule).toContain(`path: 'foo'`);
      expect(appRoutingModule).toContain('foo-page.module');
      expect(appRoutingModule).toContain('FooPageModule');
    });

    it('should register route in page routing module when subpaging is detected', async () => {
      appTree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();
      const tree = await schematicRunner
        .runSchematicAsync('page', { ...defaultOptions, name: 'foo-bar' }, appTree)
        .toPromise();
      const appRoutingModule = tree.readContent('/src/app/pages/app-routing.module.ts');
      expect(appRoutingModule).toContain(`path: 'foo'`);
      expect(appRoutingModule).toContain("import('./foo/foo-page.module')");
      expect(appRoutingModule).toContain('FooPageModule');
      expect(appRoutingModule).not.toContain('FooBar');

      const fooRoutingModule = tree.readContent('/src/app/pages/foo/foo-page.module.ts');
      expect(fooRoutingModule).toContain(`path: 'bar'`);
      expect(fooRoutingModule).toContain("import('../foo-bar/foo-bar-page.module')");
      expect(fooRoutingModule).toContain('FooBarPageModule');
    });

    it('should not register route in not existing page routing module even when subpaging is detected', async () => {
      const tree = await schematicRunner
        .runSchematicAsync('page', { ...defaultOptions, name: 'foo-bar' }, appTree)
        .toPromise();
      const appRoutingModule = tree.readContent('/src/app/pages/app-routing.module.ts');
      expect(appRoutingModule).toContain(`path: 'foo-bar'`);
      expect(appRoutingModule).toContain("import('./foo-bar/foo-bar-page.module')");
      expect(appRoutingModule).toContain('FooBarPageModule');
    });
  });

  describe('with lazy === false', () => {
    const defaultOptions: Options = {
      name: 'foo',
      project: 'bar',
      lazy: false,
    };

    it('should create a page in root by default', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();
      const files = tree.files.filter(x => x.search('foo-page') >= 0);
      expect(files).toIncludeAllMembers([
        '/src/app/pages/foo/foo-page.component.ts',
        '/src/app/pages/foo/foo-page.component.html',
        '/src/app/pages/foo/foo-page.component.spec.ts',
      ]);
      expect(tree.readContent('/src/app/pages/foo/foo-page.component.html')).toContain('foo-page works!');
    });

    it('should not create a page module', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();

      expect(tree.exists('/src/app/pages/foo/foo-page.module.ts')).toBeFalse();
    });

    it('should register page component in app module', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();

      const appModule = tree.readContent('/src/app/app.module.ts');

      expect(appModule).toContain("import { FooPageComponent } from './pages/foo/foo-page.component';");
      expect(appModule).toMatch(/declarations: \[[^\]]*FooPageComponent/);
    });

    it('should create a correct test for the component', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();
      const componentSpecContent = tree.readContent('/src/app/pages/foo/foo-page.component.spec.ts');
      expect(componentSpecContent).toContain(`import { FooPageComponent } from './foo-page.component'`);
    });

    it('should statically register route in app routing module by default', async () => {
      const tree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();
      const appRoutingModule = tree.readContent('/src/app/pages/app-routing.module.ts');
      expect(appRoutingModule).toContain("{ path: 'foo', component: FooPageComponent }");
      expect(appRoutingModule).toContain("import { FooPageComponent } from './foo/foo-page.component'");
    });

    it('should statically register route in feature routing module', async () => {
      const options = { ...defaultOptions, extension: 'feature' };

      const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
      const appRoutingModule = tree.readContent('/src/app/extensions/feature/pages/feature-routing.module.ts');
      expect(appRoutingModule).toContain(`{ path: 'foo', component: FooPageComponent }`);
      expect(appRoutingModule).toContain("import { FooPageComponent } from './foo/foo-page.component'");
    });

    it('should statically register route in feature routing module when it is the first', async () => {
      const options = { ...defaultOptions, extension: 'feature2' };

      const tree = await schematicRunner.runSchematicAsync('page', options, appTree).toPromise();
      const appRoutingModule = tree.readContent('/src/app/extensions/feature2/pages/feature2-routing.module.ts');
      expect(appRoutingModule).toContain(`{ path: 'foo', component: FooPageComponent }`);
      expect(appRoutingModule).toContain("import { FooPageComponent } from './foo/foo-page.component'");
    });

    it('should ignore subpaging and register page in same module', async () => {
      appTree = await schematicRunner.runSchematicAsync('page', defaultOptions, appTree).toPromise();
      const tree = await schematicRunner
        .runSchematicAsync('page', { ...defaultOptions, name: 'foo-bar' }, appTree)
        .toPromise();
      const appRoutingModule = tree.readContent('/src/app/pages/app-routing.module.ts');
      expect(appRoutingModule).toContain(`{ path: 'foo', component: FooPageComponent }`);
      expect(appRoutingModule).toContain("import { FooPageComponent } from './foo/foo-page.component'");

      expect(appRoutingModule).toContain(`{ path: 'foo/bar', component: FooBarPageComponent }`);
      expect(appRoutingModule).toContain("import { FooBarPageComponent } from './foo-bar/foo-bar-page.component'");
    });
  });
});
