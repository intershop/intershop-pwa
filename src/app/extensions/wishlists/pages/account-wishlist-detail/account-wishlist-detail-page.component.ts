import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';

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

  constructor(private appFacade: AppFacade, private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.wishlist$ = this.wishlistsFacade.currentWishlist$;
    this.wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;
    this.wishlistError$ = this.wishlistsFacade.wishlistError$;

    this.patchBreadcrumbData();
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

  private patchBreadcrumbData() {
    this.wishlist$
      .pipe(
        whenTruthy(),
        withLatestFrom(this.appFacade.breadcrumbData$),
        takeUntil(this.destroy$)
      )
      .subscribe(([wishlist, breadcrumbData]) => {
        this.appFacade.setBreadcrumbData([
          ...breadcrumbData.slice(0, breadcrumbData.length - 1),
          { text: wishlist.title },
        ]);
      });
  }
}
