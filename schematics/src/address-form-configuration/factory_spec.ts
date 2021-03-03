import { UnitTestTree } from '@angular-devkit/schematics/testing';

import { copyFileFromPWA, createApplication, createSchematicRunner } from '../utils/testHelper';

import { PWAAddressFormConfigurationOptionsSchema as Options } from './schema';

describe('Address Form Configuration Schematic', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    project: 'bar',
    countryCode: 'EX',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner)
      .pipe(copyFileFromPWA('src/app/shared/formly-address-forms/formly-address-forms.module.ts'))
      .toPromise();
  });
  it('should create an address form configuration and register it in the module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('address-form-configuration', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('formly-address-forms') >= 0);
    expect(files).toContain('/src/app/shared/formly-address-forms/configurations/ex/address-form-ex.configuration.ts');
    expect(files).toContain('/src/app/shared/formly-address-forms/formly-address-forms.module.ts');

    expect(tree.readContent('/src/app/shared/formly-address-forms/formly-address-forms.module.ts')).toContain(
      '{ provide: ADDRESS_FORM_CONFIGURATION, useClass: AddressFormEXConfiguration, multi: true }'
    );
  });
});
