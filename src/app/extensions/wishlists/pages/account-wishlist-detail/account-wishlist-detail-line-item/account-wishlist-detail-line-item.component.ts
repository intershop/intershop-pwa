import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType } from 'ish-core/models/product/product.helper';

import { WishlistsFacade } from '../../../facades/wishlists.facade';
import { Wishlist, WishlistItem } from '../../../models/wishlist/wishlist.model';

/**
 * The Wishlist item component displays a wishlist item. This Item can be removed or moved to another wishlist.
 */
@Component({
  selector: 'ish-account-wishlist-detail-line-item',
  templateUrl: './account-wishlist-detail-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductContextFacade],
})
export class AccountWishlistDetailLineItemComponent implements OnChanges, OnInit {
  constructor(private wishlistsFacade: WishlistsFacade, private context: ProductContextFacade) {}

  @Input() wishlistItemData: WishlistItem;
  @Input() currentWishlist: Wishlist;

  product$: Observable<AnyProductViewType>;

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  ngOnChanges() {
    this.context.set('sku', () => this.wishlistItemData.sku);
  }

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
