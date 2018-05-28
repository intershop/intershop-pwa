import { BasketItemData } from './basket-item.interface';
import { BasketItemMapper } from './basket-item.mapper';
import { BasketItem } from './basket-item.model';

describe('Basket Item Mapper', () => {
  describe('fromData', () => {
    it(`should return BasketItem when getting BasketItemData with a product.sku reference`, () => {
      const basketItemData = {
        id: 'basketItemId',
        product: {
          type: 'Link',
          description: 'Product Name',
          title: 'SKU',
          uri: 'some-shop/products/SKU',
        },
      } as BasketItemData;
      const basketItem: BasketItem = BasketItemMapper.fromData(basketItemData);

      expect(basketItem).toBeTruthy();
      expect(basketItem.product.sku).toBe(basketItemData.product.title);
    });
  });
});
