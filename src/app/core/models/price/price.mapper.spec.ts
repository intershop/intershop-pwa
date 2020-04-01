import { PriceData } from './price.interface';
import { PriceMapper } from './price.mapper';

describe('Price Mapper', () => {
  describe('fromData', () => {
    it('should map price data to client object', () => {
      expect(PriceMapper.fromData({ currency: 'EUR', value: 1.23 })).toMatchInlineSnapshot(`
        Object {
          "currency": "EUR",
          "type": "Money",
          "value": 1.23,
        }
      `);
    });
    it('should not map price data if currency is missing', () => {
      expect(PriceMapper.fromData({} as PriceData)).toBeUndefined();
      expect(PriceMapper.fromData({ value: 1.23 } as PriceData)).toBeUndefined();
      expect(PriceMapper.fromData({ value: 1.23, currency: 'N/A' })).toBeUndefined();
    });
  });
});
