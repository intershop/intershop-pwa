import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { noop } from 'rxjs';

import { createApplication, createModule, createSchematicRunner } from '../utils/testHelper';

import { PwaCmsComponentOptionsSchema as Options } from './schema';

describe('CMS Component Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    definitionQualifiedName: 'app_sf_responsive_cm:component.common.foo.pagelet2-Component',
    styleFile: false,
    styleext: 'scss',
    module: undefined,
    export: false,
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(
        createModule(schematicRunner, { name: 'shared' }),
        createModule(schematicRunner, { name: 'shared/cms' })
      )
      .toPromise();
  });

  it('should create a component in cms module with added name prefix', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner.runSchematicAsync('cms-component', options, appTree).toPromise();
    expect(tree.files.filter(x => x.search('cms') >= 0)).toMatchInlineSnapshot(`
      Array [
        "/projects/bar/src/app/shared/cms/cms.module.ts",
        "/projects/bar/src/app/shared/cms/components/cms-foo/cms-foo.component.ts",
        "/projects/bar/src/app/shared/cms/components/cms-foo/cms-foo.component.html",
        "/projects/bar/src/app/shared/cms/components/cms-foo/cms-foo.component.spec.ts",
      ]
    `);
    expect(tree.readContent('/projects/bar/src/app/shared/cms/cms.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { CMSFooComponent } from './components/cms-foo/cms-foo.component';

      @NgModule({
        imports: [],
        declarations: [],
        exports: [],
        entryComponents: [],
        providers: [{
            provide: CMS_COMPONENT,
            useValue: {
              definitionQualifiedName: 'app_sf_responsive_cm:component.common.foo.pagelet2-Component',
              class: CMSFooComponent,
            },
            multi: true,
          }]
      })
      export class CmsModule { }
      "
    `);
    expect(tree.readContent('/projects/bar/src/app/shared/shared.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { CMSFooComponent } from './cms/components/cms-foo/cms-foo.component';

      @NgModule({
        imports: [],
        declarations: [CMSFooComponent],
        exports: [],
        entryComponents: [CMSFooComponent]
      })
      export class SharedModule { }
      "
    `);
  });

  it('should create a component in cms module without added name prefix if requested', async () => {
    const options = { ...defaultOptions, noCMSPrefixing: true };
    const tree = await schematicRunner.runSchematicAsync('cms-component', options, appTree).toPromise();
    expect(tree.files.filter(x => x.search('cms') >= 0)).toMatchInlineSnapshot(`
      Array [
        "/projects/bar/src/app/shared/cms/cms.module.ts",
        "/projects/bar/src/app/shared/cms/components/foo/foo.component.ts",
        "/projects/bar/src/app/shared/cms/components/foo/foo.component.html",
        "/projects/bar/src/app/shared/cms/components/foo/foo.component.spec.ts",
      ]
    `);
    expect(tree.readContent('/projects/bar/src/app/shared/cms/cms.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { FooComponent } from './components/foo/foo.component';

      @NgModule({
        imports: [],
        declarations: [],
        exports: [],
        entryComponents: [],
        providers: [{
            provide: CMS_COMPONENT,
            useValue: {
              definitionQualifiedName: 'app_sf_responsive_cm:component.common.foo.pagelet2-Component',
              class: FooComponent,
            },
            multi: true,
          }]
      })
      export class CmsModule { }
      "
    `);
    expect(tree.readContent('/projects/bar/src/app/shared/shared.module.ts')).toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { FooComponent } from './cms/components/foo/foo.component';

      @NgModule({
        imports: [],
        declarations: [FooComponent],
        exports: [],
        entryComponents: [FooComponent]
      })
      export class SharedModule { }
      "
    `);
  });

  it('should throw when definitionQualifiedName is missing', done => {
    const options = { ...defaultOptions, definitionQualifiedName: undefined };
    schematicRunner.runSchematicAsync('cms-component', options, appTree).subscribe(noop, err => {
      expect(err).toMatchInlineSnapshot(`[Error: Option (definitionQualifiedName) is required.]`);
      done();
    });
  });
});
