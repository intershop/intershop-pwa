import { AttributeFactory } from '../attribute/attribute.factory';
import { FactoryHelper } from '../factory-helper';
import { WishlistItemData } from './wishlist-item.interface';
import { WishlistItem } from './wishlist-item.model';

export class WishlistItemFactory {

  static fromData(data: WishlistItemData): WishlistItem {
    const wishlistItem: WishlistItem = new WishlistItem();
    FactoryHelper.primitiveMapping<WishlistItemData, WishlistItem>(data, wishlistItem);
    if (data.attributes) {
      wishlistItem.attributes = data.attributes.map(attribute => AttributeFactory.fromData(attribute));
    }
    return wishlistItem;
  }
}
