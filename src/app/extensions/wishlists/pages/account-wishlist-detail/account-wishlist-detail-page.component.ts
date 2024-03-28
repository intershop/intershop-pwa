import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, filter, take, takeUntil } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistSharing } from '../../models/wishlist-sharing/wishlist-sharing.model';
import { Wishlist, WishlistItem } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-account-wishlist-detail-page',
  templateUrl: './account-wishlist-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistDetailPageComponent implements OnDestroy, OnInit {
  wishlist$: Observable<Wishlist>;
  wishlistError$: Observable<HttpError>;
  wishlistLoading$: Observable<boolean>;

  private destroy = new Subject<void>();

  constructor(private wishlistsFacade: WishlistsFacade, private translate: TranslateService) {}

  ngOnInit() {
    this.wishlist$ = this.wishlistsFacade.currentWishlist$;
    this.wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;
    this.wishlistError$ = this.wishlistsFacade.wishlistError$;
  }

  editPreferences(wishlist: Wishlist, wishlistName: string) {
    this.wishlistsFacade.updateWishlist({
      ...wishlist,
      id: wishlistName,
    });
  }

  unshareWishlist(wishlistId: string) {
    this.wishlistsFacade.unshareWishlist(wishlistId);
  }

  shareWishlist(wishlistSharing: WishlistSharing, wishlist: Wishlist) {
    this.wishlistsFacade.shareWishlist(wishlist.id, wishlistSharing);

    // ensure owner and secureCode are in the store
    this.wishlistsFacade.currentWishlist$
      .pipe(
        filter(updatedWishlist => !!updatedWishlist?.owner && !!updatedWishlist?.secureCode),
        take(1),
        takeUntil(this.destroy)
      )
      .subscribe(updatedWishlist => {
        this.sendEmail(wishlistSharing, updatedWishlist);
      });
  }

  sendEmail(wishlistSharing: WishlistSharing, wishlist: Wishlist) {
    const emailSubject = this.translate.instant('email.wishlist_sharing.heading');
    const defaultText = this.translate.instant('email.wishlist_sharing.text');

    const emailBody = `${wishlistSharing.message || defaultText} ${wishlist.title}\n${
      window.location.origin
    }/wishlists/${wishlist.id}?owner=${wishlist.owner}&secureCode=${wishlist.secureCode}`;

    const mailtoLink = `mailto:${wishlistSharing.recipients}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    window.open(mailtoLink);
  }

  trackByFn(_: number, item: WishlistItem) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
