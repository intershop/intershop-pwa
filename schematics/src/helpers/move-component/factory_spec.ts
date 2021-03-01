import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createModule, createSchematicRunner } from '../../utils/testHelper';

describe('move-component Schematic', () => {
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
  });

  it('should move component from a to b', async () => {
    appTree = await schematicRunner
      .runSchematicAsync('move-component', { project: 'bar', from: 'foo/dummy', to: 'foo' }, appTree)
      .toPromise();

    expect(appTree.files.filter(x => x.includes('/src/app/')).sort()).toMatchInlineSnapshot(`
      Array [
        "/src/app/app-routing.module.ts",
        "/src/app/app.component.css",
        "/src/app/app.component.html",
        "/src/app/app.component.spec.ts",
        "/src/app/app.component.ts",
        "/src/app/app.module.ts",
        "/src/app/foo/foo.component.html",
        "/src/app/foo/foo.component.spec.ts",
        "/src/app/foo/foo.component.ts",
        "/src/app/shared/dummy-two/dummy-two.component.html",
        "/src/app/shared/dummy-two/dummy-two.component.spec.ts",
        "/src/app/shared/dummy-two/dummy-two.component.ts",
        "/src/app/shared/shared.module.ts",
      ]
    `);
  });

  it('should rename component everywhere when moving', async () => {
    appTree = await schematicRunner
      .runSchematicAsync('move-component', { project: 'bar', from: 'foo/dummy', to: 'foo' }, appTree)
      .toPromise();

    expect(appTree.readContent('/src/app/app.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { BrowserModule } from '@angular/platform-browser';

      import { AppRoutingModule } from './app-routing.module';
      import { AppComponent } from './app.component';
      import { FooComponent } from './foo/foo.component';

      @NgModule({
        declarations: [
          AppComponent,
          FooComponent
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

    expect(appTree.readContent('/src/app/app.component.html')).toMatchInlineSnapshot(`"<ish-foo></ish-foo>"`);

    expect(appTree.readContent('/src/app/foo/foo.component.spec.ts')).toMatchInlineSnapshot(`
      "import { ComponentFixture, TestBed } from '@angular/core/testing';

      import { FooComponent } from './foo.component';

      describe('DummyComponent', () => {
        let component: FooComponent;
        let fixture: ComponentFixture<FooComponent>;
        let element: HTMLElement;

        beforeEach(async () => {
          await TestBed.configureTestingModule({
            declarations: [FooComponent]
          }).compileComponents();
        });

        beforeEach(() => {
          fixture = TestBed.createComponent(FooComponent);
          component = fixture.componentInstance;
          element = fixture.nativeElement;
        });

        it('should be created', () => {
          expect(component).toBeTruthy();
          expect(element).toBeTruthy();
          expect(() => fixture.detectChanges()).not.toThrow();
        });
      });
      "
    `);

    expect(appTree.readContent('/src/app/foo/foo.component.ts')).toMatchInlineSnapshot(`
      "import { ChangeDetectionStrategy, Component } from '@angular/core';

      @Component({
        selector: 'ish-foo',
        templateUrl: './foo.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      export class FooComponent {}
      "
    `);
  });

  it.each([
    { from: 'shared/dummy-two', to: 'shared/foo' },
    { from: 'src/app/shared/dummy-two', to: 'src/app/shared/foo' },
  ])('should rename component everywhere when moving %j', async ({ from, to }) => {
    appTree = await schematicRunner
      .runSchematicAsync('move-component', { project: 'bar', from, to }, appTree)
      .toPromise();

    expect(appTree.readContent('/src/app/shared/shared.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { FooComponent } from './foo/foo.component';

      @NgModule({
        imports: [],
        declarations: [FooComponent],
        exports: []
      })
      export class SharedModule { }
      "
    `);

    expect(appTree.files.filter(f => f.endsWith('component.ts'))).toMatchInlineSnapshot(`
      Array [
        "/src/app/app.component.ts",
        "/src/app/shared/foo/foo.component.ts",
        "/src/app/foo/dummy/dummy.component.ts",
      ]
    `);

    expect(appTree.readContent('/src/app/shared/foo/foo.component.ts')).toMatchInlineSnapshot(`
      "import { ChangeDetectionStrategy, Component } from '@angular/core';
      import { DummyComponent } from '../../../foo/dummy/dummy.component';

      @Component({
        selector: 'ish-foo',
        templateUrl: './foo.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      export class FooComponent {}
      "
    `);

    expect(appTree.readContent('/src/app/shared/foo/foo.component.spec.ts')).toContain(
      `import { FooComponent } from './foo.component';`
    );

    expect(appTree.readContent('/src/app/foo/dummy/dummy.component.spec.ts')).toContain(
      `import { DummyComponent } from './dummy.component';`
    );
  });
});
