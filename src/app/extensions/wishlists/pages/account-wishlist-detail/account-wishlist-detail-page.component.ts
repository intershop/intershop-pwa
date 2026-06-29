import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistSharing } from '../../models/wishlist-sharing/wishlist-sharing.model';
import { Wishlist } from '../../models/wishlist/wishlist.model';
import { WishlistLineItemComponent } from '../../shared/wishlist-line-item/wishlist-line-item.component';
import { WishlistPreferencesDialogComponent } from '../../shared/wishlist-preferences-dialog/wishlist-preferences-dialog.component';
import { WishlistSharingDialogComponent } from '../../shared/wishlist-sharing-dialog/wishlist-sharing-dialog.component';

@Component({
  selector: 'ish-account-wishlist-detail-page',
  imports: [
    AsyncPipe,
    ErrorMessageComponent,
    LoadingComponent,
    NgbPopover,
    ProductContextDirective,
    RouterLink,
    TranslatePipe,
    WishlistLineItemComponent,
    WishlistPreferencesDialogComponent,
    WishlistSharingDialogComponent,
  ],
  standalone: true,
  templateUrl: './account-wishlist-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistDetailPageComponent implements OnInit {
  wishlist$: Observable<Wishlist>;
  wishlistError$: Observable<HttpError>;
  wishlistLoading$: Observable<boolean>;

  constructor(private wishlistsFacade: WishlistsFacade) {}

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
  }
}
