import { BasketItem } from '../basket-item/basket-item.model';

import { Basket, BasketHelper } from './basket.model';

describe('Basket Helper', () => {
  describe('getBasketItemsCount', () => {
    let basket: Basket;
    beforeEach(() => {
      basket = { id: '123' } as Basket;
      const li = {
        quantity: { value: 2 },
      } as BasketItem;
      basket.lineItems = [li, li, li];
    });

    it('should return 0 if there is no basket given', () => {
      expect(BasketHelper.getBasketItemsCount(undefined)).toEqual(0);
    });

    it('should return the number of item if there is a basket given', () => {
      expect(BasketHelper.getBasketItemsCount(basket)).toEqual(6);
    });
  });
});
