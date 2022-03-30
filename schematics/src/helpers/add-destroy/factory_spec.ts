import { switchMap } from '@angular-devkit/core/node_modules/rxjs/operators';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { PWAComponentOptionsSchema } from 'schemas/component/schema';

import { createApplication, createSchematicRunner } from '../../utils/testHelper';

describe('Lazy Component Schematic', () => {
  const schematicRunner = createSchematicRunner();

  let appTree: UnitTestTree;
  beforeEach(async () => {
    const appTree$ = createApplication(schematicRunner).pipe(
      switchMap(tree =>
        schematicRunner.runSchematicAsync(
          'component',
          {
            project: 'bar',
            name: 'foo',
          } as PWAComponentOptionsSchema,
          tree
        )
      )
    );
    appTree = await appTree$.toPromise();
  });

  it('should be created', () => {
    expect(appTree.files).toContain('/src/app/foo/foo.component.ts');
  });

  it('should be runnable on a component', async () => {
    await schematicRunner
      .runSchematicAsync(
        'add-destroy',
        {
          project: 'bar',
          name: 'src/app/foo/foo.component.ts',
        },
        appTree
      )
      .toPromise();
  });

  it('should be runnable on the folder of a component', async () => {
    await schematicRunner
      .runSchematicAsync(
        'add-destroy',
        {
          project: 'bar',
          name: 'src/app/foo',
        },
        appTree
      )
      .toPromise();
  });

  it('should be runnable on the relative project folder of a component', async () => {
    await schematicRunner
      .runSchematicAsync(
        'add-destroy',
        {
          project: 'bar',
          name: 'foo',
        },
        appTree
      )
      .toPromise();
  });

  describe('after run', () => {
    let content: string;

    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'add-destroy',
          {
            project: 'bar',
            name: 'src/app/foo/foo.component.ts',
          },
          appTree
        )
        .toPromise();
      content = appTree.readContent('src/app/foo/foo.component.ts');
    });

    it('should add import for OnDestroy', () => {
      expect(content).toMatch(/OnDestroy.* from .@angular\/core.;/);
    });

    it('should add import for Subject', () => {
      expect(content).toMatch(/Subject.* from .rxjs.;/);
    });

    it('should add implements for OnDestroy', () => {
      expect(content).toMatch(/implements.*OnDestroy/);
    });

    it('should add destroy$ subject', () => {
      expect(content).toContain('destroy$ = new Subject<void>();');
    });

    it('should add ngOnDestroy method', () => {
      expect(content).toContain('ngOnDestroy()');
      expect(content).toContain('this.destroy$.next();');
      expect(content).toContain('this.destroy$.complete();');
    });
  });
});
