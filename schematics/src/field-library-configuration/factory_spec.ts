import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { PWAFieldLibrarySchema as Options } from 'schemas/field-library-configuration/schema';

import { copyFileFromPWA, createApplication, createSchematicRunner } from '../utils/testHelper';

describe('Address Form Configuration Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    project: 'bar',
    name: 'address-line-6',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    const appTree$ = createApplication(schematicRunner).pipe(
      copyFileFromPWA('src/app/shared/formly/field-library/field-library.module.ts')
    );
    appTree = await appTree$.toPromise();
  });
  it('should create an field library configuration and register it in the module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('field-library-configuration', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('field-library') >= 0);
    expect(files).toContain('/src/app/shared/formly/field-library/configurations/address-line-6.configuration.ts');
    expect(files).toContain('/src/app/shared/formly/field-library/field-library.module.ts');

    expect(tree.readContent('/src/app/shared/formly/field-library/field-library.module.ts')).toContain(
      '{ provide: FIELD_LIBRARY_CONFIGURATION, useClass: AddressLine6Configuration, multi: true }'
    );
  });
});
