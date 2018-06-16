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
      valueRebates: data.valueRebates,
      isHiddenGift: data.isHiddenGift,
      isFreeGift: data.isFreeGift,
      inStock: data.inStock,
      variationProduct: data.variationProduct,
      bundleProduct: data.bundleProduct,
      availability: data.availability,
      totals: data.totals,

      productSKU: data.product.title,
    };

    return basketItem;
  }
}
