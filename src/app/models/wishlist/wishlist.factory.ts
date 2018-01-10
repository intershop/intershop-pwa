import { FactoryHelper } from '../factory-helper';
import { WishlistItemFactory } from '../wishlist-item/wishlist-item.factory';
import { WishlistData } from './wishlist.interface';
import { Wishlist } from './wishlist.model';

export class WishlistFactory {

  static fromData(data: WishlistData): Wishlist {
    const wishlist: Wishlist = new Wishlist();
    FactoryHelper.primitiveMapping<WishlistData, Wishlist>(data, wishlist);
    if (data.items) {
      wishlist.items = data.items.map(item => WishlistItemFactory.fromData(item));
    }
    return wishlist;
  }
}
