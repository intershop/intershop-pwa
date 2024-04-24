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
  wishlistId: string;
  owner: string;
  secureCode: string;
  wishlist$: Observable<Wishlist>;
  wishlistError$: Observable<HttpError>;
  wishlistLoading$: Observable<boolean>;

  constructor(private wishlistsFacade: WishlistsFacade) {}

  ngOnInit(): void {
    this.wishlist$ = this.wishlistsFacade.currentWishlist$;
    this.wishlistError$ = this.wishlistsFacade.wishlistError$;
    this.wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;
  }

  trackByFn(_: number, item: WishlistItem) {
    return item.id;
  }
}
