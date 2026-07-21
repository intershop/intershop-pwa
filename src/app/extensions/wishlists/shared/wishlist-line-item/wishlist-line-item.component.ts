import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist, WishlistItem } from '../../models/wishlist/wishlist.model';

/**
 * The Wishlist item component displays a wishlist item. This Item can be removed or moved to another wishlist.
 */
@Component({
  selector: 'ish-wishlist-line-item',
  standalone: false,
  templateUrl: './wishlist-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistLineItemComponent {
  constructor(private wishlistsFacade: WishlistsFacade) {}

  @Input({ required: true }) wishlistItemData: WishlistItem;
  @Input({ required: true }) currentWishlist: Wishlist;
  @Input() readOnly = false;

  @Output() readonly moveClicked = new EventEmitter<string>();

  emitMoveClicked() {
    this.moveClicked.emit(this.wishlistItemData.id);
  }

  removeProductFromWishlist(sku: string) {
    this.wishlistsFacade.removeProductFromWishlist(this.currentWishlist.id, sku);
  }
}
