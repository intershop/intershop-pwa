import { PriceItem } from 'ish-core/models/price-item/price-item.interface';

import { PriceMapper } from './price.mapper';

describe('Price Mapper', () => {
  describe('fromData', () => {
    it(`should return Price when getting a PriceItem`, () => {
      const priceItem = {
        gross: {
          value: 43.34,
          currency: 'USD',
        },
        net: {
          value: 40.34,
          currency: 'USD',
        },
      } as PriceItem;
      const price = PriceMapper.fromPriceItem(priceItem);

      expect(price).toBeTruthy();
      expect(price.value).toBe(priceItem[PriceMapper.defaultPriceType].value);
      expect(price.currency).toBe('USD');
    });
  });
});
