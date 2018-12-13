import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as ModuleOptions } from '@schematics/angular/module/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { PwaExtensionOptionsSchema as Options } from './schema';

describe('Extension Schematic', () => {
  const schematicRunner = new SchematicTestRunner('intershop-schematics', require.resolve('../collection.json'));
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(done => {
    schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
      } as WorkspaceOptions)
      .toPromise()
      .then(workspace =>
        schematicRunner
          .runExternalSchematicAsync(
            '@schematics/angular',
            'application',
            {
              name: 'bar',
              inlineStyle: false,
              inlineTemplate: false,
              routing: true,
              style: 'css',
              skipTests: false,
              skipPackageJson: false,
              prefix: 'ish',
            } as ApplicationOptions,
            workspace
          )
          .toPromise()
          .then(application =>
            schematicRunner
              .runExternalSchematicAsync(
                '@schematics/angular',
                'module',
                {
                  name: 'pages/app-not-found-routing',
                  flat: true,
                  project: 'bar',
                  module: 'app.module',
                } as ModuleOptions,
                application
              )
              .toPromise()
              .then(tree => {
                schematicRunner
                  .runSchematicAsync('module', { name: 'shared', project: 'bar' }, tree)
                  .toPromise()
                  .then(completeTree => {
                    appTree = completeTree;
                    done();
                  });
              })
          )
      );
  });

  it('should create a page in root by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('extension', options, appTree);
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/extensions/foo/foo.module.ts",
  "/projects/bar/src/app/extensions/foo/exports/foo-exports.module.ts",
  "/projects/bar/src/app/extensions/foo/pages/foo-routing.module.ts",
  "/projects/bar/src/app/extensions/foo/store/foo-store.ts",
  "/projects/bar/src/app/extensions/foo/store/foo-store.module.ts",
]
`);
  });

  it('should import extension exports in app module, before NotFoundRouting module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('extension', options, appTree);
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatchInlineSnapshot(`
"import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppNotFoundRoutingModule } from './pages/app-not-found-routing.module';
import { FooExportsModule } from './extensions/foo/exports/foo-exports.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FooExportsModule, AppNotFoundRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
"
`);
  });

  it('should import extension exports in shared module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('extension', options, appTree);
    const sharedModuleContent = tree.readContent('/projects/bar/src/app/shared/shared.module.ts');
    expect(sharedModuleContent).toMatchInlineSnapshot(`
"import { NgModule } from '@angular/core';
import { FooExportsModule } from '../extensions/foo/exports/foo-exports.module';

@NgModule({
  imports: [FooExportsModule],
  declarations: [],
  exports: [FooExportsModule],
  entryComponents: []
})
export class SharedModule { }
"
`);
  });

  it('should throw if app module does not contain AppNotFoundRoutingModule', () => {
    appTree.overwrite(
      '/projects/bar/src/app/app.module.ts',
      `import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
`
    );

    const options = { ...defaultOptions };

    expect(() => schematicRunner.runSchematic('extension', options, appTree)).toThrowError(/did not find/);
  });
});
