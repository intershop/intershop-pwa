import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable, filter, take } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistSharing } from '../../models/wishlist-sharing/wishlist-sharing.model';
import { Wishlist, WishlistItem } from '../../models/wishlist/wishlist.model';

@Component({
  selector: 'ish-account-wishlist-detail-page',
  templateUrl: './account-wishlist-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistDetailPageComponent implements OnInit {
  wishlist$: Observable<Wishlist>;
  wishlistError$: Observable<HttpError>;
  wishlistLoading$: Observable<boolean>;

  private destroyedRef = inject(DestroyRef);

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

  shareWishlist(wishlistSharing: WishlistSharing, wishlistId: string) {
    this.wishlistsFacade.shareWishlist(wishlistId, wishlistSharing);

    // ensure owner and secureCode are in the store
    this.wishlist$
      .pipe(
        filter(updatedWishlist => !!updatedWishlist?.owner && !!updatedWishlist?.secureCode),
        take(1),
        takeUntilDestroyed(this.destroyedRef)
      )
      .subscribe(updatedWishlist => {
        this.sendEmail(wishlistSharing, updatedWishlist);
      });
  }

  private sendEmail(wishlistSharing: WishlistSharing, wishlist: Wishlist) {
    const emailSubject = this.translate.instant('email.wishlist_sharing.heading');
    const defaultText = this.translate.instant('email.wishlist_sharing.text');

    // get the base url, but consider multi-channel baseHref configurations
    const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -3).join('/');
    const emailBody = `${wishlistSharing.message || defaultText} ${wishlist.title}\n${baseUrl}/wishlists/${
      wishlist.id
    }?owner=${wishlist.owner}&secureCode=${wishlist.secureCode}`;

    const mailtoLink = `mailto:${wishlistSharing.recipients}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    window.open(mailtoLink);
  }

  trackByFn(_: number, item: WishlistItem) {
    return item.id;
  }
}
