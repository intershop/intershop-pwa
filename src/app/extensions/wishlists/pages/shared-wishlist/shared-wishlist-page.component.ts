import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistItem } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlist-page',
  templateUrl: './shared-wishlist-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedWishlistPageComponent {
  wishlist$ = this.wishlistsFacade.sharedWishlist$;
  wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;

  constructor(private wishlistsFacade: WishlistsFacade) {}

  trackByFn(_: number, item: WishlistItem) {
    return item.id;
  }
}
