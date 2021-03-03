import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createModule, createSchematicRunner } from '../../utils/testHelper';

describe('customized-copy Schematic', () => {
  const schematicRunner = createSchematicRunner();

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(createModule(schematicRunner, { name: 'shared' }))
      .toPromise();
    appTree.overwrite('/src/app/app.component.html', '<ish-dummy></ish-dummy>');
    appTree = await schematicRunner
      .runSchematicAsync('component', { project: 'bar', name: 'foo/dummy' }, appTree)
      .toPromise();
    appTree = await schematicRunner
      .runSchematicAsync('component', { project: 'bar', name: 'shared/dummy-two' }, appTree)
      .toPromise();

    appTree.overwrite(
      '/src/app/shared/dummy-two/dummy-two.component.ts',
      `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DummyComponent } from '../../../foo/dummy/dummy.component';

@Component({
  selector: 'ish-dummy-two',
  templateUrl: './dummy-two.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DummyTwoComponent {}
`
    );

    const angularJson = JSON.parse(appTree.readContent('/angular.json'));
    angularJson.projects.bar.prefix = 'custom';
    appTree.overwrite('/angular.json', JSON.stringify(angularJson));
  });

  it('should be created', () => {
    expect(appTree.files.filter(f => f.endsWith('component.ts'))).toMatchInlineSnapshot(`
      Array [
        "/src/app/app.component.ts",
        "/src/app/shared/dummy-two/dummy-two.component.ts",
        "/src/app/foo/dummy/dummy.component.ts",
      ]
    `);
    expect(appTree.readContent('/src/app/shared/dummy-two/dummy-two.component.ts')).toMatchInlineSnapshot(`
      "import { ChangeDetectionStrategy, Component } from '@angular/core';
      import { DummyComponent } from '../../../foo/dummy/dummy.component';

      @Component({
        selector: 'ish-dummy-two',
        templateUrl: './dummy-two.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      export class DummyTwoComponent {}
      "
    `);

    expect(JSON.parse(appTree.readContent('/angular.json')).projects.bar.prefix).toMatchInlineSnapshot(`"custom"`);

    expect(appTree.readContent('/src/app/app.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { BrowserModule } from '@angular/platform-browser';

      import { AppRoutingModule } from './app-routing.module';
      import { AppComponent } from './app.component';
      import { DummyComponent } from './foo/dummy/dummy.component';

      @NgModule({
        declarations: [
          AppComponent,
          DummyComponent
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
    expect(appTree.readContent('/src/app/shared/shared.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { DummyTwoComponent } from './dummy-two/dummy-two.component';

      @NgModule({
        imports: [],
        declarations: [DummyTwoComponent],
        exports: []
      })
      export class SharedModule { }
      "
    `);
  });

  it('should customize component in root module', async () => {
    appTree = await schematicRunner
      .runSchematicAsync('customized-copy', { project: 'bar', from: 'foo/dummy' }, appTree)
      .toPromise();

    expect(appTree.files.filter(x => x.includes('/src/app/')).sort()).toMatchInlineSnapshot(`
      Array [
        "/src/app/app-routing.module.ts",
        "/src/app/app.component.css",
        "/src/app/app.component.html",
        "/src/app/app.component.spec.ts",
        "/src/app/app.component.ts",
        "/src/app/app.module.ts",
        "/src/app/foo/custom-dummy/custom-dummy.component.html",
        "/src/app/foo/custom-dummy/custom-dummy.component.spec.ts",
        "/src/app/foo/custom-dummy/custom-dummy.component.ts",
        "/src/app/foo/dummy/dummy.component.html",
        "/src/app/foo/dummy/dummy.component.spec.ts",
        "/src/app/foo/dummy/dummy.component.ts",
        "/src/app/shared/dummy-two/dummy-two.component.html",
        "/src/app/shared/dummy-two/dummy-two.component.spec.ts",
        "/src/app/shared/dummy-two/dummy-two.component.ts",
        "/src/app/shared/shared.module.ts",
      ]
    `);

    expect(appTree.readContent('/src/app/app.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { BrowserModule } from '@angular/platform-browser';

      import { AppRoutingModule } from './app-routing.module';
      import { AppComponent } from './app.component';
      import { CustomDummyComponent } from './foo/custom-dummy/custom-dummy.component';
      import { DummyComponent } from './foo/dummy/dummy.component';

      @NgModule({
        declarations: [
          AppComponent,
          CustomDummyComponent,
          DummyComponent
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

    expect(appTree.readContent('/src/app/foo/custom-dummy/custom-dummy.component.ts')).toMatchInlineSnapshot(`
      "import { ChangeDetectionStrategy, Component } from '@angular/core';

      @Component({
        selector: 'custom-dummy',
        templateUrl: './custom-dummy.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      export class CustomDummyComponent {}
      "
    `);

    const specFile = appTree.readContent('/src/app/foo/custom-dummy/custom-dummy.component.spec.ts');
    expect(specFile).toContain("import { CustomDummyComponent } from './custom-dummy.component'");
    expect(specFile).toContain('let fixture: ComponentFixture<CustomDummyComponent>');
  });

  it('should customize component in shared module', async () => {
    appTree = await schematicRunner
      .runSchematicAsync('customized-copy', { project: 'bar', from: 'shared/dummy-two' }, appTree)
      .toPromise();

    expect(appTree.files.filter(x => x.includes('/src/app/')).sort()).toMatchInlineSnapshot(`
      Array [
        "/src/app/app-routing.module.ts",
        "/src/app/app.component.css",
        "/src/app/app.component.html",
        "/src/app/app.component.spec.ts",
        "/src/app/app.component.ts",
        "/src/app/app.module.ts",
        "/src/app/foo/dummy/dummy.component.html",
        "/src/app/foo/dummy/dummy.component.spec.ts",
        "/src/app/foo/dummy/dummy.component.ts",
        "/src/app/shared/custom-dummy-two/custom-dummy-two.component.html",
        "/src/app/shared/custom-dummy-two/custom-dummy-two.component.spec.ts",
        "/src/app/shared/custom-dummy-two/custom-dummy-two.component.ts",
        "/src/app/shared/dummy-two/dummy-two.component.html",
        "/src/app/shared/dummy-two/dummy-two.component.spec.ts",
        "/src/app/shared/dummy-two/dummy-two.component.ts",
        "/src/app/shared/shared.module.ts",
      ]
    `);

    expect(appTree.readContent('/src/app/app.module.ts')).not.toContain('import { CustomDummyTwoComponent }');

    expect(appTree.readContent('/src/app/shared/shared.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { CustomDummyTwoComponent } from './custom-dummy-two/custom-dummy-two.component';
      import { DummyTwoComponent } from './dummy-two/dummy-two.component';

      @NgModule({
        imports: [],
        declarations: [CustomDummyTwoComponent, DummyTwoComponent],
        exports: []
      })
      export class SharedModule { }
      "
    `);

    expect(appTree.readContent('/src/app/shared/custom-dummy-two/custom-dummy-two.component.ts'))
      .toMatchInlineSnapshot(`
      "import { ChangeDetectionStrategy, Component } from '@angular/core';
      import { DummyComponent } from '../../../foo/dummy/dummy.component';

      @Component({
        selector: 'custom-dummy-two',
        templateUrl: './custom-dummy-two.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      export class CustomDummyTwoComponent {}
      "
    `);

    const specFile = appTree.readContent('/src/app/shared/custom-dummy-two/custom-dummy-two.component.spec.ts');
    expect(specFile).toContain("import { CustomDummyTwoComponent } from './custom-dummy-two.component'");
    expect(specFile).toContain('let fixture: ComponentFixture<CustomDummyTwoComponent>');
  });
});
