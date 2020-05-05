import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { switchMap } from 'rxjs/operators';

import {
  createAppLastRoutingModule,
  createApplication,
  createModule,
  createSchematicRunner,
} from '../utils/testHelper';

import { PWALazyComponentOptionsSchema as Options } from './schema';

describe('Lazy Component Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    project: 'bar',
    prefix: 'foo',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(
        createModule(schematicRunner, { name: 'shared' }),
        createModule(schematicRunner, { name: 'shell' }),
        createAppLastRoutingModule(schematicRunner),
        switchMap(tree => schematicRunner.runSchematicAsync('extension', { ...defaultOptions, name: 'ext' }, tree)),
        switchMap(tree =>
          schematicRunner.runSchematicAsync(
            'component',
            { ...defaultOptions, name: 'extensions/ext/shared/group/dummy' },
            tree
          )
        )
      )
      .toPromise();
  });

  it('should be created', () => {
    expect(appTree.files).toContain('/projects/bar/src/app/extensions/ext/shared/group/dummy/dummy.component.ts');
  });

  it.each([
    'extensions/ext/shared/group',
    'extensions/ext/shared/group/other/other.component.ts',
    'src/app/extensions/ext/shared/group/other/other.component.ts',
    'src/app/shared/other/other.component.ts',
  ])('should fail for path %s', async path => {
    const err = await schematicRunner
      .runSchematicAsync('lazy-component', { ...defaultOptions, path }, appTree)
      .toPromise()
      .catch(error => error);

    expect(err.message).toEqual('path does not point to an existing component in an extension');
  });

  it.each([
    'extensions/ext/shared/group/dummy/dummy.component.ts',
    'src/app/extensions/ext/shared/group/dummy/dummy.component.ts',
  ])('should generate a lazy component for %s', async path => {
    const tree = await schematicRunner
      .runSchematicAsync('lazy-component', { ...defaultOptions, path }, appTree)
      .toPromise();

    expect(tree.files).toIncludeAllMembers([
      '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.ts',
      '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.html',
    ]);
  });

  describe('empty component', () => {
    let tree: UnitTestTree;
    let htmlContent: string;
    let componentContent: string;
    let exportsModuleContent: string;

    beforeEach(async () => {
      tree = await schematicRunner
        .runSchematicAsync(
          'lazy-component',
          { ...defaultOptions, path: 'extensions/ext/shared/group/dummy/dummy.component.ts' },
          appTree
        )
        .toPromise();

      htmlContent = tree.readContent(
        '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.html'
      );
      componentContent = tree.readContent(
        '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.ts'
      );
      exportsModuleContent = tree.readContent('/projects/bar/src/app/extensions/ext/exports/ext-exports.module.ts');
    });

    it('should generate a template with generating warning', async () => {
      expect(htmlContent).toContain('ng g lazy-component extensions/ext/shared/group/dummy/dummy.component.ts');
    });

    it('should generate a component with generating warning', async () => {
      expect(componentContent).toContain('ng g lazy-component extensions/ext/shared/group/dummy/dummy.component.ts');
    });

    it('should have anchor reference and use it in component', async () => {
      expect(htmlContent).toContain('#anchor');
      expect(componentContent).toContain("@ViewChild('anchor'");
    });

    it('should import component which is lazy loaded', async () => {
      expect(componentContent).toMatch(/import.*from '.*\/shared\/group\/dummy\/dummy.component'/);
    });

    it('should load component using ivy', async () => {
      expect(componentContent).toContain('.resolveComponentFactory(DummyComponent)');
    });

    it('should check if extension is enabled', async () => {
      expect(componentContent).toContain(".enabled('ext')");
    });

    it('should generate right component selector', async () => {
      expect(componentContent).toContain("selector: 'foo-lazy-dummy'");
    });

    it('should reference the right template', async () => {
      expect(componentContent).toContain("templateUrl: './lazy-dummy.component.html'");
    });

    it('should generate lazy component definition', async () => {
      expect(componentContent).toContain('export class LazyDummyComponent');
    });

    it('should import lazy component in exports module', async () => {
      expect(exportsModuleContent).toMatch(
        "import { LazyDummyComponent } from './group/lazy-dummy/lazy-dummy.component';"
      );
    });

    it('should declare lazy component in exports module', async () => {
      expect(exportsModuleContent).toMatch(/declarations:.*LazyDummyComponent/);
    });

    it('should export lazy component in exports module', async () => {
      expect(exportsModuleContent).toMatch(/exports:.*LazyDummyComponent/);
    });

    it('should add decorator to original component', () => {
      expect(tree.readContent('/projects/bar/src/app/extensions/ext/shared/group/dummy/dummy.component.ts')).toContain(
        '@GenerateLazyComponent()'
      );
    });
  });

  describe('ci', () => {
    let tree: UnitTestTree;
    let exportsModuleContent: string;
    let originalComponent: string;

    beforeEach(async () => {
      tree = await schematicRunner
        .runSchematicAsync(
          'lazy-component',
          { ...defaultOptions, path: 'extensions/ext/shared/group/dummy/dummy.component.ts', ci: true },
          appTree
        )
        .toPromise();

      exportsModuleContent = tree.readContent('/projects/bar/src/app/extensions/ext/exports/ext-exports.module.ts');

      originalComponent = tree.readContent(
        '/projects/bar/src/app/extensions/ext/shared/group/dummy/dummy.component.ts'
      );
    });

    it('should generate the lazy component', async () => {
      expect(tree.files).toIncludeAllMembers([
        '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.html',
        '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.ts',
      ]);
    });

    it('should not touch exports module', () => {
      expect(exportsModuleContent).not.toContain('LazyDummyComponent');
    });

    it('should not touch original component', () => {
      expect(originalComponent).not.toContain('@GenerateLazyComponent()');
    });
  });

  describe('component with inputs', () => {
    let tree: UnitTestTree;
    let componentContent: string;

    beforeEach(async () => {
      appTree.overwrite(
        '/projects/bar/src/app/extensions/ext/shared/group/dummy/dummy.component.ts',
        `import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';

import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-dummy',
  templateUrl: './dummy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DummyComponent {
  @Input() simpleTyped: boolean;
  @Input() simpleTypedInitialized = true;
  @Input() complexTyped: 'a' | 'b';
  @Input() complexTypedInitialized: 'a' | 'b' = 'a';
  @Input() importTyped: Product;
}
`
      );
      tree = await schematicRunner
        .runSchematicAsync(
          'lazy-component',
          { ...defaultOptions, path: 'extensions/ext/shared/group/dummy/dummy.component.ts' },
          appTree
        )
        .toPromise();

      componentContent = tree.readContent(
        '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.ts'
      );
    });

    it('should copy inputs', () => {
      expect(componentContent).toContain('@Input() simpleTyped: boolean;');
      expect(componentContent).toContain('@Input() simpleTypedInitialized = true;');
      expect(componentContent).toContain("@Input() complexTyped: 'a' | 'b';");
      expect(componentContent).toContain("@Input() complexTypedInitialized: 'a' | 'b' = 'a';");
      expect(componentContent).toContain('@Input() importTyped: Product;');
    });

    it('should transfer inputs', () => {
      expect(componentContent).toContain('component.instance.simpleTyped = this.simpleTyped');
      expect(componentContent).toContain('component.instance.simpleTypedInitialized = this.simpleTypedInitialized');
      expect(componentContent).toContain('component.instance.complexTyped = this.complexTyped');
      expect(componentContent).toContain('component.instance.complexTypedInitialized = this.complexTypedInitialized');
      expect(componentContent).toContain('component.instance.importTyped = this.importTyped');
    });

    it('should copy imports', () => {
      expect(componentContent).toContain("import { Product } from 'ish-core/models/product/product.model';");
    });
  });

  describe('overwriting', () => {
    beforeEach(() => {
      appTree.create(
        '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.ts',
        'ORIGINAL'
      );
    });

    it('should overwrite existing lazy component', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'lazy-component',
          { ...defaultOptions, path: 'extensions/ext/shared/group/dummy/dummy.component.ts' },
          appTree
        )
        .toPromise();

      expect(tree.files).toIncludeAllMembers([
        '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.ts',
        '/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.html',
      ]);

      expect(
        tree.readContent('/projects/bar/src/app/extensions/ext/exports/group/lazy-dummy/lazy-dummy.component.ts')
      ).toContain('export class LazyDummyComponent');
    });
  });
});
