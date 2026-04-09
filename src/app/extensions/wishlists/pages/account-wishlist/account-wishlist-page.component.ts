import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';
import { WishlistPreferencesDialogComponent } from '../../shared/wishlist-preferences-dialog/wishlist-preferences-dialog.component';

import { AccountWishlistListComponent } from './account-wishlist-list/account-wishlist-list.component';

@Component({
  selector: 'ish-account-wishlist-page',
  templateUrl: './account-wishlist-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AccountWishlistListComponent,
    AsyncPipe,
    WishlistPreferencesDialogComponent,
    TranslatePipe,
    ErrorMessageComponent,
    NgbPopover,
    LoadingComponent,
  ],
})
export class AccountWishlistPageComponent implements OnInit {
  /**
   * The list of wishlists of the customer.
   */
  wishlists$: Observable<Wishlist[]>;
  /**
   * Indicator for loading state of wishlists
   */
  wishlistLoading$: Observable<boolean>;
  /**
   * Error state in case of an error during creation of a new wishlist.
   */
  wishlistError$: Observable<HttpError>;

  constructor(private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.wishlists$ = this.wishlistsFacade.wishlists$;
    this.wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;
    this.wishlistError$ = this.wishlistsFacade.wishlistError$;
  }

  /** dispatch delete request */
  deleteWishlist(id: string) {
    this.wishlistsFacade.deleteWishlist(id);
  }

  /** dispatch creation request */
  addWishlist(wishlist: WishlistHeader) {
    this.wishlistsFacade.addWishlist(wishlist);
  }
}
