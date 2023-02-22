import { Link } from 'ish-core/models/link/link.model';

import { WarrantyData } from './warranty.interface';
import { WarrantyMapper } from './warranty.mapper';

describe('Warranty Mapper', () => {
  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => WarrantyMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = {
        sku: 'test',
        name: 'testWarranty',
        shortDescription: 'Warranty period: 1 year',
        longDescription: 'Insurance against breakdown',
        price: 100,
        currencyCode: 'USD',
        attributes: [{ name: 'attributeName', value: 'attributeValue' }],
      } as WarrantyData;
      expect(WarrantyMapper.fromData(data)).toMatchInlineSnapshot(`
        Object {
          "attributes": Array [
            Object {
              "name": "attributeName",
              "value": "attributeValue",
            },
          ],
          "id": "test",
          "longDescription": "Insurance against breakdown",
          "name": "testWarranty",
          "price": Object {
            "currency": "USD",
            "type": "Money",
            "value": 100,
          },
          "shortDescription": "Warranty period: 1 year",
        }
      `);
    });
  });

  describe('fromLinkData', () => {
    it('should map incoming link data to model data', () => {
      const warranties: Link[] = [
        {
          type: 'Link',
          uri: 'inSPIRED-inTRONICS-Site/rest;loc=en_US;cur=USD/products;spgid=lTk4L_PyIIiRpDbHqOcO3csS0000/1YLEDTVSUP',
          title: '1-year LED TV Support',
          description: 'Insurance against breakdown. Warranty period: 1 year.',
          attributes: [
            {
              name: 'WarrantyPrice',
              value: {
                type: 'Money',
                value: 106,
                currencyMnemonic: 'USD',
                currency: 'USD',
              },
            },
          ],
        },
      ];

      expect(WarrantyMapper.fromLinkData(warranties)).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "1YLEDTVSUP",
            "name": "1-year LED TV Support",
            "price": Object {
              "currency": "USD",
              "type": "Money",
              "value": 106,
            },
          },
        ]
      `);
    });
  });
});
