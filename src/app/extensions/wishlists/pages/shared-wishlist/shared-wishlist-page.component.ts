import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist, WishlistItem } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-wishlist-page',
  templateUrl: './shared-wishlist-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedWishlistPageComponent implements OnInit {
  wishlist$: Observable<Wishlist>;
  wishlistError$: Observable<HttpError>;
  wishlistLoading$: Observable<boolean>;

  constructor(private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.wishlist$ = this.wishlistsFacade.sharedWishlist$;
    this.wishlistError$ = this.wishlistsFacade.sharedWishlistError$;
    this.wishlistLoading$ = this.wishlistsFacade.sharedWishlistLoading$;
  }

  trackByFn(_: number, item: WishlistItem) {
    return item.id;
  }
}
