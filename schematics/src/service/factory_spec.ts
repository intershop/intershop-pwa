import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

import { PWAServiceOptionsSchema as Options } from './schema';

describe('Service Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).toPromise();
  });

  it('should create a service in core by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('service', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.service') >= 0);
    expect(files).toContain('/src/app/core/services/foo/foo.service.spec.ts');
    expect(files).toContain('/src/app/core/services/foo/foo.service.ts');

    expect(tree.readContent('/src/app/core/services/foo/foo.service.ts')).toContain(
      'ish-core/services/api/api.service'
    );
  });

  it('should ignore folders in name', async () => {
    const options = { ...defaultOptions, name: 'foobar/bar/foo' };

    const tree = await schematicRunner.runSchematicAsync('service', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.service') >= 0);
    expect(files).toContain('/src/app/core/services/foo/foo.service.spec.ts');
    expect(files).toContain('/src/app/core/services/foo/foo.service.ts');
  });

  it('should create a service in extension if supplied', async () => {
    const options = { ...defaultOptions, extension: 'feature' };

    const tree = await schematicRunner.runSchematicAsync('service', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.service') >= 0);
    expect(files).toContain('/src/app/extensions/feature/services/foo/foo.service.spec.ts');
    expect(files).toContain('/src/app/extensions/feature/services/foo/foo.service.ts');

    expect(tree.readContent('/src/app/extensions/feature/services/foo/foo.service.ts')).toContain(
      'ish-core/services/api/api.service'
    );
  });

  it('should create a service in extension if implied by name', async () => {
    const options = { ...defaultOptions, name: 'src/app/extensions/feature/services/foo' };

    const tree = await schematicRunner.runSchematicAsync('service', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('foo.service') >= 0);
    expect(files).toContain('/src/app/extensions/feature/services/foo/foo.service.spec.ts');
    expect(files).toContain('/src/app/extensions/feature/services/foo/foo.service.ts');

    expect(tree.readContent('/src/app/extensions/feature/services/foo/foo.service.ts')).toContain(
      'ish-core/services/api/api.service'
    );
  });

  it('service should be tree-shakeable', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('service', options, appTree).toPromise();
    const content = tree.readContent('/src/app/core/services/foo/foo.service.ts');
    expect(content).toMatch(/providedIn: 'root'/);
  });
});
