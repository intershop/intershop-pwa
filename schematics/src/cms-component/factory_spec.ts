import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { concatMap, switchMap } from 'rxjs/operators';

import { PwaModuleOptionsSchema } from '../module/schema';

import { PwaCmsComponentOptionsSchema as Options } from './schema';

describe('Component Schematic', () => {
  const schematicRunner = new SchematicTestRunner('intershop-schematics', require.resolve('../collection.json'));
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
  beforeEach(done => {
    schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
      } as WorkspaceOptions)
      .pipe(
        concatMap(tree =>
          schematicRunner.runExternalSchematicAsync(
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
            tree
          )
        ),
        switchMap(tree =>
          schematicRunner.runSchematicAsync('module', { project: 'bar', name: 'cms' } as PwaModuleOptionsSchema, tree)
        )
      )
      .subscribe(tree => {
        appTree = tree;
        done();
      });
  });

  it('should create a component in cms module', () => {
    const options = { ...defaultOptions };
    const tree = schematicRunner.runSchematic('cms-component', options, appTree);
    expect(tree.files.filter(x => x.search('cms') >= 0)).toMatchInlineSnapshot(`
Array [
  "/projects/bar/src/app/cms/cms.module.ts",
  "/projects/bar/src/app/cms/components/foo/foo.component.ts",
  "/projects/bar/src/app/cms/components/foo/foo.component.html",
  "/projects/bar/src/app/cms/components/foo/foo.component.spec.ts",
]
`);
    const moduleContent = tree.readContent('/projects/bar/src/app/cms/cms.module.ts');
    expect(moduleContent).toMatchInlineSnapshot(`
"import { NgModule } from '@angular/core';
import { FooComponent } from './components/foo/foo.component';

@NgModule({
  imports: [],
  declarations: [FooComponent],
  exports: [],
  entryComponents: [FooComponent],
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
  });

  it('should throw when definitionQualifiedName is missing', () => {
    const options = { ...defaultOptions, definitionQualifiedName: undefined };
    expect(() => schematicRunner.runSchematic('cms-component', options, appTree)).toThrow();
  });
});
