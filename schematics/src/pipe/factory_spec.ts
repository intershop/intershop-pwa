import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createModule, createSchematicRunner } from '../utils/testHelper';

import { PWAPipeOptionsSchema as Options } from './schema';

describe('Pipe Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(createModule(schematicRunner, { name: 'extensions/feature/feature', flat: true }))
      .toPromise();

    appTree.create(
      '/src/app/core/pipes.module.ts',
      `
import { NgModule } from '@angular/core';

const pipes = [];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
  providers: [...pipes],
})
export class PipesModule { }
`
    );
  });

  it('should create a pipe in core by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('pipe', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.pipe') >= 0);
    expect(files).toContain('/src/app/core/pipes/foo.pipe.spec.ts');
    expect(files).toContain('/src/app/core/pipes/foo.pipe.ts');
  });

  it('should register pipe in pipes module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('pipe', options, appTree).toPromise();
    const content = tree.readContent('/src/app/core/pipes.module.ts');
    expect(content).toContain('FooPipe');
    expect(content).toContain('./pipes/foo.pipe');
    expect(content).toMatchInlineSnapshot(`
"
import { NgModule } from '@angular/core';
import { FooPipe } from './pipes/foo.pipe';

const pipes = [];

@NgModule({
  declarations: [...pipes, FooPipe],
  exports: [...pipes, FooPipe],
  providers: [...pipes, FooPipe],
})
export class PipesModule { }
"
`);
  });

  it('should ignore folders in name', async () => {
    const options = { ...defaultOptions, name: 'foobar/bar/foo' };

    const tree = await schematicRunner.runSchematicAsync('pipe', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.pipe') >= 0);
    expect(files).toContain('/src/app/core/pipes/foo.pipe.spec.ts');
    expect(files).toContain('/src/app/core/pipes/foo.pipe.ts');
  });

  it('should create a pipe in extension if supplied', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('pipe', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.pipe') >= 0);
    expect(files).toContain('/src/app/extensions/feature/pipes/foo.pipe.spec.ts');
    expect(files).toContain('/src/app/extensions/feature/pipes/foo.pipe.ts');
  });

  it('should create a pipe in extension if detected via input', async () => {
    const options = { ...defaultOptions, name: 'extensions/feature/foo' };

    const tree = await schematicRunner.runSchematicAsync('pipe', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.pipe') >= 0);
    expect(files).toContain('/src/app/extensions/feature/pipes/foo.pipe.spec.ts');
    expect(files).toContain('/src/app/extensions/feature/pipes/foo.pipe.ts');
  });

  it('should register pipe in extension module', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('pipe', options, appTree).toPromise();
    const content = tree.readContent('/src/app/extensions/feature/feature.module.ts');
    expect(content).toContain('FooPipe');
  });
});
