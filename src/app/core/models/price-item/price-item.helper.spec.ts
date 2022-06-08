import { PriceItemHelper } from './price-item.helper';
import { ScaledPriceItem } from './price-item.model';

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
  describe('selectScaledPriceType', () => {
    const priceItem: ScaledPriceItem = {
      currency: 'USD',
      gross: 43.34,
      net: 40.34,
      type: 'PriceItem' as 'PriceItem',
      minQuantity: 2,
    };

    it('should select gross price if requested', () => {
      expect(PriceItemHelper.selectScaledPriceType(priceItem, 'gross')).toMatchInlineSnapshot(`
        Object {
          "currency": "USD",
          "minQuantity": 2,
          "type": "Money",
          "value": 43.34,
        }
      `);
    });

    it('should select net price if requested', () => {
      expect(PriceItemHelper.selectScaledPriceType(priceItem, 'net')).toMatchInlineSnapshot(`
        Object {
          "currency": "USD",
          "minQuantity": 2,
          "type": "Money",
          "value": 40.34,
        }
      `);
    });
  });
});
