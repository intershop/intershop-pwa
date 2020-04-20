import { PriceItemData } from './price-item.interface';
import { PriceItemMapper } from './price-item.mapper';

describe('Price Item Mapper', () => {
  describe('fromPriceItem', () => {
    it(`should return Price when getting a PriceItem`, () => {
      const price = PriceItemMapper.fromPriceItem({
        gross: {
          value: 43.34,
          currency: 'USD',
        },
        net: {
          value: 40.34,
          currency: 'USD',
        },
      });

      expect(price).toMatchInlineSnapshot(`
        Object {
          "currency": "USD",
          "gross": 43.34,
          "net": 40.34,
          "type": "PriceItem",
        }
      `);
    });

    it(`should return undefined on falsy input`, () => {
      expect(PriceItemMapper.fromPriceItem(undefined)).toBeUndefined();
    });

    it(`should return undefined if input is missing either gross or net price`, () => {
      expect(
        PriceItemMapper.fromPriceItem({ gross: { value: 0.11, currency: 'EUR' } } as PriceItemData)
      ).toBeUndefined();
      expect(PriceItemMapper.fromPriceItem({ net: { value: 0.11, currency: 'EUR' } } as PriceItemData)).toBeUndefined();
    });
  });

  describe('fromSpecificPriceItem', () => {
    it(`should return Price when getting a PriceItem`, () => {
      const price = PriceItemMapper.fromSpecificPriceItem(
        {
          gross: {
            value: 43.34,
            currency: 'USD',
          },
          net: {
            value: 40.34,
            currency: 'USD',
          },
        },
        'net'
      );

      expect(price).toMatchInlineSnapshot(`
        Object {
          "currency": "USD",
          "type": "Money",
          "value": 40.34,
        }
      `);
    });

    it(`should undefined on falsy input`, () => {
      expect(PriceItemMapper.fromSpecificPriceItem(undefined, undefined)).toBeUndefined();
      expect(PriceItemMapper.fromSpecificPriceItem(undefined, 'gross')).toBeUndefined();
    });
  });
});
