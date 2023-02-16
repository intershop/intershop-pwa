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
      } as WarrantyData;
      expect(WarrantyMapper.fromData(data)).toMatchInlineSnapshot(`
        Object {
          "code": undefined,
          "id": "test",
          "longDescription": "Insurance against breakdown",
          "name": "testWarranty",
          "price": Object {
            "currency": "USD",
            "type": "Money",
            "value": 100,
          },
          "shortDescription": "Warranty period: 1 year",
          "timePeriod": undefined,
          "type": undefined,
          "years": undefined,
        }
      `);
    });
  });
});
