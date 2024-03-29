import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { lastValueFrom } from 'rxjs';
import { PWAExtensionOptionsSchema as Options } from 'schemas/extension/schema';

import {
  createAppLastRoutingModule,
  createApplication,
  createModule,
  createSchematicRunner,
} from '../utils/testHelper';

describe('Extension Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    const appTree$ = createApplication(schematicRunner).pipe(
      createModule(schematicRunner, { name: 'shared', project: undefined }),
      createAppLastRoutingModule(schematicRunner)
    );
    appTree = await lastValueFrom(appTree$);
  });

  it('should create an extension', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('extension', options, appTree);
    const files = tree.files.filter(x => x.search('foo') >= 0);
    expect(files).toMatchInlineSnapshot(`
      [
        "/src/app/extensions/foo/foo.module.ts",
        "/src/app/extensions/foo/exports/.gitignore",
        "/src/app/extensions/foo/exports/foo-exports.module.ts",
        "/src/app/extensions/foo/facades/foo.facade.ts",
        "/src/app/extensions/foo/pages/foo-routing.module.ts",
        "/src/app/extensions/foo/store/foo-store.module.ts",
        "/src/app/extensions/foo/store/foo-store.ts",
      ]
    `);
  });

  it('should import extension routing in app module, before NotFoundRouting module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('extension', options, appTree);
    const appModuleContent = tree.readContent('/src/app/app.module.ts');
    expect(appModuleContent).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { BrowserModule } from '@angular/platform-browser';

      import { AppRoutingModule } from './app-routing.module';
      import { AppComponent } from './app.component';
      import { AppLastRoutingModule } from './pages/app-last-routing.module';
      import { FooRoutingModule } from './extensions/foo/pages/foo-routing.module';

      @NgModule({
        declarations: [
          AppComponent
        ],
        imports: [
          BrowserModule,
          AppRoutingModule,
          FooRoutingModule, AppLastRoutingModule
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
      "
    `);
  });

  it('should import and export extension exports in shared module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('extension', options, appTree);
    const sharedModuleContent = tree.readContent('/src/app/shared/shared.module.ts');
    expect(sharedModuleContent).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { FooExportsModule } from '../extensions/foo/exports/foo-exports.module';

      @NgModule({
        imports: [
          FooExportsModule
        ],
        declarations: [],
        exports: [
          FooExportsModule
        ]
      })
      export class SharedModule { }
      "
    `);
  });

  it('should add extension to the environment model feature list', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('extension', options, appTree);
    const environmentModelContent = tree.readContent('/src/environments/environment.model.ts');
    expect(environmentModelContent).toInclude("| 'foo'");
  });

  it('should throw if app module does not contain AppLastRoutingModule', done => {
    appTree.overwrite(
      '/src/app/app.module.ts',
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

    schematicRunner.runSchematic('extension', options, appTree).catch(err => {
      expect(err).toMatchInlineSnapshot(`[Error: did not find 'AppLastRoutingModule' in /src/app/app.module.ts]`);
      done();
    });
  });
});
