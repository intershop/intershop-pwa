import { OrderItemData } from '../order-item/order-item.interface';

import { BasketItemData } from './basket-item.interface';
import { BasketItemMapper } from './basket-item.mapper';

describe('Basket Item Mapper', () => {
  describe('fromData', () => {
    it(`should return BasketItem when getting BasketItemData`, () => {
      const basketItemData = {
        id: 'basketItemId',
        product: 'sku_123',
        quantity: {
          value: 3,
        },
      } as BasketItemData;
      const basketItem = BasketItemMapper.fromData(basketItemData);

      expect(basketItem).toBeTruthy();
      expect(basketItem.productSKU).toBe(basketItemData.product);
      expect(basketItem.quantity.value).toBe(3);
    });
  });

  describe('fromOrderItemData', () => {
    it(`should return BasketItem when getting OrderItemData with a product.sku reference`, () => {
      const orderItemData = {
        id: 'orderItemId',
        product: {
          type: 'Link',
          description: 'Product Name',
          title: 'SKU',
          uri: 'some-shop/products/SKU',
        },
        quantity: {
          value: 3,
        },
      } as OrderItemData;
      const basketItem = BasketItemMapper.fromOrderItemData(orderItemData);

      expect(basketItem).toBeTruthy();
      expect(basketItem.productSKU).toBe(orderItemData.product.title);
      expect(basketItem.quantity.value).toBe(3);
    });
  });
});
