import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { lastValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PWAComponentOptionsSchema } from 'schemas/component/schema';

import { createApplication, createSchematicRunner } from '../../utils/testHelper';

describe('Lazy Component Schematic', () => {
  const schematicRunner = createSchematicRunner();

  let appTree: UnitTestTree;
  beforeEach(async () => {
    const appTree$ = createApplication(schematicRunner).pipe(
      switchMap(tree =>
        schematicRunner.runSchematic(
          'component',
          {
            project: 'bar',
            name: 'foo',
          } as PWAComponentOptionsSchema,
          tree
        )
      )
    );
    appTree = await lastValueFrom(appTree$);
  });

  it('should be created', () => {
    expect(appTree.files).toContain('/src/app/foo/foo.component.ts');
  });

  it('should be runnable on a component', async () => {
    await schematicRunner.runSchematic(
      'add-destroy',
      {
        project: 'bar',
        name: 'src/app/foo/foo.component.ts',
      },
      appTree
    );
  });

  it('should be runnable on the folder of a component', async () => {
    await schematicRunner.runSchematic(
      'add-destroy',
      {
        project: 'bar',
        name: 'src/app/foo',
      },
      appTree
    );
  });

  it('should be runnable on the relative project folder of a component', async () => {
    await schematicRunner.runSchematic(
      'add-destroy',
      {
        project: 'bar',
        name: 'foo',
      },
      appTree
    );
  });

  describe('after run', () => {
    let content: string;

    beforeEach(async () => {
      appTree = await schematicRunner.runSchematic(
        'add-destroy',
        {
          project: 'bar',
          name: 'src/app/foo/foo.component.ts',
        },
        appTree
      );
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
