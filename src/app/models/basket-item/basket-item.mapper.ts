import { Product } from '../product/product.model';
import { BasketItemData } from './basket-item.interface';
import { BasketItem } from './basket-item.model';

export class BasketItemMapper {
  static fromData(data: BasketItemData) {
    const basketItem: BasketItem = {
      id: data.id,
      name: data.name,
      position: data.position,
      quantity: data.quantity,
      price: data.price,
      singleBasePrice: data.singleBasePrice,
      itemSurcharges: data.itemSurcharges,
      isHiddenGift: data.isHiddenGift,
      isFreeGift: data.isFreeGift,
      inStock: data.inStock,
      variationProduct: data.variationProduct,
      bundleProduct: data.bundleProduct,
      availability: data.availability,

      product: { sku: data.product.title } as Product,
    };

    return basketItem;
  }
}
