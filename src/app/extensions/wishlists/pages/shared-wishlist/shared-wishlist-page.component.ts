import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistItem } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlist-page',
  templateUrl: './shared-wishlist-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedWishlistPageComponent {
  private readonly wishlistsFacade = inject(WishlistsFacade);

  wishlist$ = this.wishlistsFacade.currentWishlist$;
  wishlistError$ = this.wishlistsFacade.wishlistError$;
  wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;

  trackByFn(_: number, item: WishlistItem) {
    return item.id;
  }
}
