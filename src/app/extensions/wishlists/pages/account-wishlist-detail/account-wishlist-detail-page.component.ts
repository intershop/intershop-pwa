import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-account-wishlist-detail-page',
  templateUrl: './account-wishlist-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistDetailPageComponent implements OnInit, OnDestroy {
  wishlist$: Observable<Wishlist>;
  wishlistError$: Observable<HttpError>;
  wishlistLoading$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.wishlist$ = this.wishlistsFacade.currentWishlist$;
    this.wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;
    this.wishlistError$ = this.wishlistsFacade.wishlistError$;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  editPreferences(wishlist: Wishlist, wishlistName: string) {
    this.wishlistsFacade.updateWishlist({
      ...wishlist,
      id: wishlistName,
    });
  }
}
