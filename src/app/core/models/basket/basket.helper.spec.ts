import { BasketItem } from '../basket-item/basket-item.model';

import { BasketHelper } from './basket.model';

describe('Basket Helper', () => {
  describe('getBasketItemsCount', () => {
    let lineItems: BasketItem[];
    beforeEach(() => {
      const li = {
        quantity: { value: 2 },
      } as BasketItem;
      lineItems = [li, li, li];
    });

    it('should return 0 if there is no basket given', () => {
      expect(BasketHelper.getBasketItemsCount(undefined)).toEqual(0);
    });

    it('should return the number of item if there is a basket given', () => {
      expect(BasketHelper.getBasketItemsCount(lineItems)).toEqual(6);
    });
  });
});
