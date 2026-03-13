import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { lastValueFrom } from 'rxjs';
import { PWAPageOptionsSchema as Options } from 'schemas/page/schema';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

describe('Page Schematic', () => {
  const schematicRunner = createSchematicRunner();

  let appTree: UnitTestTree;
  beforeEach(async () => {
    const appTree$ = createApplication(schematicRunner);
    appTree = await lastValueFrom(appTree$);

    appTree.create(
      '/src/app/pages/app.routes.ts',
      `
      const routes = [
        { path: 'some', component: Dummy },
        { path: 'other', component: Dummy },
        { path: 'routes', component: Dummy },
      ];
    `
    );
    appTree.create(
      '/src/app/extensions/feature/pages/feature.routes.ts',
      `
      const featureRoutes = [{ path: 'some', component: Dummy }];
    `
    );
    appTree.create(
      '/src/app/extensions/feature2/pages/feature2.routes.ts',
      `
      const feature2Routes = [];
    `
    );
  });

  describe('with lazy === true', () => {
    const defaultOptions: Options = {
      name: 'foo',
      project: 'bar',
    };

    it('should create a page in root by default', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);
      const files = tree.files.filter(x => x.search('foo-page') >= 0);

      expect(files).toIncludeAllMembers([
        '/src/app/pages/foo/foo-page.component.ts',
        '/src/app/pages/foo/foo-page.component.html',
        '/src/app/pages/foo/foo-page.component.spec.ts',
      ]);
    });

    it('should create page routes and no page module', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);

      expect(tree.exists('/src/app/pages/foo/foo-page.routes.ts')).toBeTrue();
      expect(tree.exists('/src/app/pages/foo/foo-page.module.ts')).toBeFalse();

      const pageRoutes = tree.readContent('/src/app/pages/foo/foo-page.routes.ts');
      expect(pageRoutes).toContain("import { FooPageComponent } from './foo-page.component';");
      expect(pageRoutes).toContain(`export const fooPageRoutes: Routes = [{ path: '', component: FooPageComponent }];`);
      expect(pageRoutes).not.toContain('NgModule');
      expect(pageRoutes).not.toContain('SharedModule');
    });

    it('should create a correct test for the component', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);
      const componentSpecContent = tree.readContent('/src/app/pages/foo/foo-page.component.spec.ts');
      expect(componentSpecContent).toContain(`import { FooPageComponent } from './foo-page.component'`);
    });

    it('should lazily register route in app routes by default', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);
      const appRoutes = tree.readContent('/src/app/pages/app.routes.ts');
      expect(appRoutes).toContain(`path: 'foo'`);
      expect(appRoutes).toContain(`import('./foo/foo-page.routes')`);
      expect(appRoutes).toContain('fooPageRoutes');
      expect(appRoutes).not.toContain('foo-page.module');
      expect(appRoutes).not.toContain('FooPageModule');
    });

    it('should lazily register route in app routes override by default', async () => {
      appTree.create('/src/app/pages/app.routes.all.ts', appTree.readContent('/src/app/pages/app.routes.ts'));

      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);

      const appRoutes = tree.readContent('/src/app/pages/app.routes.ts');
      expect(appRoutes).not.toContain(`path: 'foo'`);

      const appRoutesOverride = tree.readContent('/src/app/pages/app.routes.all.ts');
      expect(appRoutesOverride).toContain(`path: 'foo'`);
      expect(appRoutesOverride).toContain(`import('./foo/foo-page.routes')`);
      expect(appRoutesOverride).toContain('fooPageRoutes');
    });

    it('should create a page in extension if supplied', async () => {
      const options = { ...defaultOptions, extension: 'feature' };

      const tree = await schematicRunner.runSchematic('page', options, appTree);
      const files = tree.files.filter(x => x.search('foo-page') >= 0);
      expect(files).toIncludeAllMembers([
        '/src/app/extensions/feature/pages/foo/foo-page.routes.ts',
        '/src/app/extensions/feature/pages/foo/foo-page.component.ts',
        '/src/app/extensions/feature/pages/foo/foo-page.component.html',
        '/src/app/extensions/feature/pages/foo/foo-page.component.spec.ts',
      ]);

      const pageRoutes = tree.readContent('/src/app/extensions/feature/pages/foo/foo-page.routes.ts');
      expect(pageRoutes).toContain("import { FooPageComponent } from './foo-page.component';");
      expect(pageRoutes).toContain(`export const fooPageRoutes: Routes = [{ path: '', component: FooPageComponent }];`);
      expect(pageRoutes).not.toContain('FeatureModule');
      expect(pageRoutes).not.toContain('.module');
    });

    it('should create a page in extension if implied by name', async () => {
      const options = { ...defaultOptions, name: 'extensions/feature/pages/foo' };

      const tree = await schematicRunner.runSchematic('page', options, appTree);
      const files = tree.files.filter(x => x.search('foo-page') >= 0);
      expect(files).toIncludeAllMembers([
        '/src/app/extensions/feature/pages/foo/foo-page.routes.ts',
        '/src/app/extensions/feature/pages/foo/foo-page.component.ts',
        '/src/app/extensions/feature/pages/foo/foo-page.component.html',
        '/src/app/extensions/feature/pages/foo/foo-page.component.spec.ts',
      ]);
    });

    it('should lazily register route in feature routes', async () => {
      const options = { ...defaultOptions, extension: 'feature' };

      const tree = await schematicRunner.runSchematic('page', options, appTree);
      const featureRoutes = tree.readContent('/src/app/extensions/feature/pages/feature.routes.ts');
      expect(featureRoutes).toContain(`path: 'foo'`);
      expect(featureRoutes).toContain(`import('./foo/foo-page.routes')`);
      expect(featureRoutes).toContain('fooPageRoutes');
      expect(featureRoutes).toContain(`canActivate: [featureToggleGuard], data: { feature: 'feature' }`);
      expect(featureRoutes).toContain(`feature-toggle`);
      expect(featureRoutes).not.toContain(`feature-toggle.module`);
    });

    it('should lazily register route in feature routes when it is the first', async () => {
      const options = { ...defaultOptions, extension: 'feature2' };

      const tree = await schematicRunner.runSchematic('page', options, appTree);
      const featureRoutes = tree.readContent('/src/app/extensions/feature2/pages/feature2.routes.ts');
      expect(featureRoutes).toContain(`path: 'foo'`);
      expect(featureRoutes).toContain(`import('./foo/foo-page.routes')`);
      expect(featureRoutes).toContain('fooPageRoutes');
      expect(featureRoutes).toContain(`canActivate: [featureToggleGuard], data: { feature: 'feature2' }`);
    });

    it('should register route in page routes when subpaging is detected', async () => {
      appTree = await schematicRunner.runSchematic('page', defaultOptions, appTree);
      const tree = await schematicRunner.runSchematic('page', { ...defaultOptions, name: 'foo-bar' }, appTree);
      const appRoutes = tree.readContent('/src/app/pages/app.routes.ts');
      expect(appRoutes).toContain(`path: 'foo'`);
      expect(appRoutes).toContain("import('./foo/foo-page.routes')");
      expect(appRoutes).toContain('fooPageRoutes');
      expect(appRoutes).not.toContain('FooBar');

      const fooRoutes = tree.readContent('/src/app/pages/foo/foo-page.routes.ts');
      expect(fooRoutes).toContain(`path: 'bar'`);
      expect(fooRoutes).toContain(`import('../foo-bar/foo-bar-page.routes')`);
      expect(fooRoutes).toContain('fooBarPageRoutes');
    });

    it('should not register route in non-existing subpage routes even when subpaging is detected', async () => {
      const tree = await schematicRunner.runSchematic('page', { ...defaultOptions, name: 'foo-bar' }, appTree);
      const appRoutes = tree.readContent('/src/app/pages/app.routes.ts');
      expect(appRoutes).toContain(`path: 'foo-bar'`);
      expect(appRoutes).toContain(`import('./foo-bar/foo-bar-page.routes')`);
      expect(appRoutes).toContain('fooBarPageRoutes');
    });
  });

  describe('with lazy === false', () => {
    const defaultOptions: Options = {
      name: 'foo',
      project: 'bar',
      lazy: false,
    };

    it('should create a page in root by default', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);
      const files = tree.files.filter(x => x.search('foo-page') >= 0);
      expect(files).toIncludeAllMembers([
        '/src/app/pages/foo/foo-page.component.ts',
        '/src/app/pages/foo/foo-page.component.html',
        '/src/app/pages/foo/foo-page.component.spec.ts',
      ]);
      expect(tree.readContent('/src/app/pages/foo/foo-page.component.html')).toContain('foo-page works!');
    });

    it('should not create page routes', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);

      expect(tree.exists('/src/app/pages/foo/foo-page.routes.ts')).toBeFalse();
      expect(tree.exists('/src/app/pages/foo/foo-page.module.ts')).toBeFalse();
    });

    it('should register page component in app module', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);

      const appModule = tree.readContent('/src/app/app.module.ts');

      expect(appModule).toContain("import { FooPageComponent } from './pages/foo/foo-page.component';");
      expect(appModule).toMatch(/declarations: \[[^\]]*FooPageComponent/);
    });

    it('should create a correct test for the component', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);
      const componentSpecContent = tree.readContent('/src/app/pages/foo/foo-page.component.spec.ts');
      expect(componentSpecContent).toContain(`import { FooPageComponent } from './foo-page.component'`);
    });

    it('should statically register route in app routes by default', async () => {
      const tree = await schematicRunner.runSchematic('page', defaultOptions, appTree);
      const appRoutes = tree.readContent('/src/app/pages/app.routes.ts');
      expect(appRoutes).toContain("{ path: 'foo', component: FooPageComponent }");
      expect(appRoutes).toContain("import { FooPageComponent } from './foo/foo-page.component'");
    });

    it('should statically register route in feature routes', async () => {
      const options = { ...defaultOptions, extension: 'feature' };

      const tree = await schematicRunner.runSchematic('page', options, appTree);
      const featureRoutes = tree.readContent('/src/app/extensions/feature/pages/feature.routes.ts');
      expect(featureRoutes).toContain(
        `{ path: 'foo', component: FooPageComponent, canActivate: [featureToggleGuard], data: { feature: 'feature' } }`
      );
      expect(featureRoutes).toContain("import { FooPageComponent } from './foo/foo-page.component'");
      expect(featureRoutes).toContain(`feature-toggle`);
      expect(featureRoutes).not.toContain(`feature-toggle.module`);
    });

    it('should statically register route in feature routes when it is the first', async () => {
      const options = { ...defaultOptions, extension: 'feature2' };

      const tree = await schematicRunner.runSchematic('page', options, appTree);
      const featureRoutes = tree.readContent('/src/app/extensions/feature2/pages/feature2.routes.ts');
      expect(featureRoutes).toContain(
        `{ path: 'foo', component: FooPageComponent, canActivate: [featureToggleGuard], data: { feature: 'feature2' } }`
      );
      expect(featureRoutes).toContain("import { FooPageComponent } from './foo/foo-page.component'");
    });

    it('should ignore subpaging and register page in same routes file', async () => {
      appTree = await schematicRunner.runSchematic('page', defaultOptions, appTree);
      const tree = await schematicRunner.runSchematic('page', { ...defaultOptions, name: 'foo-bar' }, appTree);
      const appRoutes = tree.readContent('/src/app/pages/app.routes.ts');
      expect(appRoutes).toContain(`{ path: 'foo', component: FooPageComponent }`);
      expect(appRoutes).toContain("import { FooPageComponent } from './foo/foo-page.component'");

      expect(appRoutes).toContain(`{ path: 'foo/bar', component: FooBarPageComponent }`);
      expect(appRoutes).toContain("import { FooBarPageComponent } from './foo-bar/foo-bar-page.component'");
    });
  });
});
