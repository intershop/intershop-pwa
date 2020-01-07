import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { WishlistsFacade } from '../../../facades/wishlists.facade';

@Component({
  selector: 'ish-wishlists-link',
  templateUrl: './wishlists-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistsLinkComponent implements OnInit, OnDestroy {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';
  itemsCount: number = undefined;
  routerLink = '/account/wishlists';
  private destroy$ = new Subject<void>();

  constructor(
    private accountFacade: AccountFacade,
    private wishlistFacade: WishlistsFacade,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // determine the item's count of the preferred wishlist
    this.wishlistFacade.wishlists$.pipe(takeUntil(this.destroy$)).subscribe(wishlists => {
      const prefWishlist = wishlists.find(wishlist => wishlist.preferred);
      this.itemsCount = prefWishlist ? prefWishlist.itemsCount : 0;
      this.cdr.markForCheck();
    });

    this.accountFacade.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(loggedIn => {
      this.routerLink = loggedIn ? '/account/wishlists' : '/login';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
