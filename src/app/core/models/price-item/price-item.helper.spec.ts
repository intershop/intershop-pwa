import { PriceItemHelper } from './price-item.helper';

describe('Price Item Helper', () => {
  describe('selectType', () => {
    const priceItem = {
      currency: 'USD',
      gross: 43.34,
      net: 40.34,
      type: 'PriceItem' as 'PriceItem',
    };

    it('should select gross price if requested', () => {
      expect(PriceItemHelper.selectType(priceItem, 'gross')).toMatchInlineSnapshot(`
        Object {
          "currency": "USD",
          "type": "Money",
          "value": 43.34,
        }
      `);
    });

    it('should select net price if requested', () => {
      expect(PriceItemHelper.selectType(priceItem, 'net')).toMatchInlineSnapshot(`
        Object {
          "currency": "USD",
          "type": "Money",
          "value": 40.34,
        }
      `);
    });
  });
});
