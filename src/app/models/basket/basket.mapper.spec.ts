import { BasketData } from './basket.interface';
import { BasketMapper } from './basket.mapper';
import { Basket } from './basket.model';

describe('Basket Mapper', () => {
  describe('fromData', () => {
    it(`should return Basket when getting BasketData`, () => {
      const basketData = {
        shippingBuckets: [
          {
            lineItems: [
              {
                name: 'test',
              },
            ],
            name: 'test',
            shippingMethod: {
              id: 'test',
            },
            shipToAddress: {
              urn: 'test',
            },
          },
        ],
      } as BasketData;
      const basket: Basket = BasketMapper.fromData(basketData);

      expect(basket).toBeTruthy();
      expect(basket.lineItems).toBe(basketData.shippingBuckets[0].lineItems);
      expect(basket.commonShippingMethod).toBe(basketData.shippingBuckets[0].shippingMethod);
      expect(basket.commonShipToAddress).toBe(basketData.shippingBuckets[0].shipToAddress);
    });
  });
});
