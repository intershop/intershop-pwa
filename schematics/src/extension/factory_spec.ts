import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { noop } from 'rxjs';

import {
  createAppLastRoutingModule,
  createApplication,
  createModule,
  createSchematicRunner,
} from '../utils/testHelper';

import { PwaExtensionOptionsSchema as Options } from './schema';

describe('Extension Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(
        createModule(schematicRunner, { name: 'shared' }),
        createModule(schematicRunner, { name: 'shell' }),
        createAppLastRoutingModule(schematicRunner)
      )
      .toPromise();
  });

  it('should create a page in root by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('extension', options, appTree).toPromise();
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

  it('should import extension exports in app module, before NotFoundRouting module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('extension', options, appTree).toPromise();
    const appModuleContent = tree.readContent('/projects/bar/src/app/app.module.ts');
    expect(appModuleContent).toMatchInlineSnapshot(`
      "import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

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

  it('should import extension exports in shared module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('extension', options, appTree).toPromise();
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

  it('should import extension exports in shell module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('extension', options, appTree).toPromise();
    const shellModuleContent = tree.readContent('/projects/bar/src/app/shell/shell.module.ts');
    expect(shellModuleContent).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { FooExportsModule } from '../extensions/foo/exports/foo-exports.module';

      @NgModule({
        imports: [FooExportsModule],
        declarations: [],
        exports: [],
        entryComponents: []
      })
      export class ShellModule { }
      "
    `);
  });

  it('should throw if app module does not contain AppLastRoutingModule', done => {
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

    schematicRunner.runSchematicAsync('extension', options, appTree).subscribe(noop, err => {
      expect(err).toMatchInlineSnapshot(
        `[Error: did not find 'AppLastRoutingModule' in /projects/bar/src/app/app.module.ts]`
      );
      done();
    });
  });
});
