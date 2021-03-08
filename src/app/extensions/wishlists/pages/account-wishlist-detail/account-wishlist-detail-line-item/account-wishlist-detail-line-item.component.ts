import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WishlistsFacade } from '../../../facades/wishlists.facade';
import { Wishlist, WishlistItem } from '../../../models/wishlist/wishlist.model';

/**
 * The Wishlist item component displays a wishlist item. This Item can be removed or moved to another wishlist.
 */
@Component({
  selector: 'ish-account-wishlist-detail-line-item',
  templateUrl: './account-wishlist-detail-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistDetailLineItemComponent {
  constructor(private wishlistsFacade: WishlistsFacade) {}

  @Input() wishlistItemData: WishlistItem;
  @Input() currentWishlist: Wishlist;

  moveItemToOtherWishlist(sku: string, wishlistMoveData: { id: string; title: string }) {
    if (wishlistMoveData.id) {
      this.wishlistsFacade.moveItemToWishlist(this.currentWishlist.id, wishlistMoveData.id, sku);
    } else {
      this.wishlistsFacade.moveItemToNewWishlist(this.currentWishlist.id, wishlistMoveData.title, sku);
    }
  }

  removeProductFromWishlist(sku: string) {
    this.wishlistsFacade.removeProductFromWishlist(this.currentWishlist.id, sku);
  }
}
