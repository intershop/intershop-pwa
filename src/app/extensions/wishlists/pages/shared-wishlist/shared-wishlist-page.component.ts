import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WishlistsFacade } from '../../facades/wishlists.facade';

@Component({
  selector: 'ish-wishlist-page',
  standalone: false,
  templateUrl: './shared-wishlist-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedWishlistPageComponent {
  wishlist$ = this.wishlistsFacade.sharedWishlist$;
  wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;

  constructor(private wishlistsFacade: WishlistsFacade) {}
}
