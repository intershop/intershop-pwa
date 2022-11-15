import { CxmlConfigurationData } from './cxml-configuration.interface';
import { CxmlConfigurationMapper } from './cxml-configuration.mapper';

describe('Cxml Configuration Mapper', () => {
  describe('fromData', () => {
    it('should return Cxml Configuration when getting CxmlConfigurationData', () => {
      expect(() => CxmlConfigurationMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: CxmlConfigurationData = {
        data: [
          {
            name: 'classificationCatalogID',
            value: '1',
          },
        ],
        info: {
          metaData: [
            {
              name: 'classificationCatalogID',
              defaultValue: 'eCl@ass',
              description: 'Enter the type of product classification catalog to be used, e.g. UNSPSC or eCl@ass.',
              inputType: 'text-short',
            },
          ],
        },
      };
      const mapped = CxmlConfigurationMapper.fromData(data);
      expect(mapped).toMatchInlineSnapshot(`
        [
          {
            "defaultValue": "eCl@ass",
            "description": "Enter the type of product classification catalog to be used, e.g. UNSPSC or eCl@ass.",
            "inputType": "text-short",
            "name": "classificationCatalogID",
            "value": "1",
          },
        ]
      `);
    });
  });
});
