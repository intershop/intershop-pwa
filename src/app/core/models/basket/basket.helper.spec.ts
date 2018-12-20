import { LineItem } from '../line-item/line-item.model';

import { BasketHelper } from './basket.model';

describe('Basket Helper', () => {
  describe('getBasketItemsCount', () => {
    let lineItems: LineItem[];
    beforeEach(() => {
      const li = {
        quantity: { value: 2 },
      } as LineItem;
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
