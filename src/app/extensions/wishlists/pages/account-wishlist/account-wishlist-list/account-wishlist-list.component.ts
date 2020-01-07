import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { Wishlist } from '../../../models/wishlist/wishlist.model';

/**
 * The Account Wishlist List Component show the customer an overview list over his wishlists.
 *
 * @example
 * <ish-account-wishlist-list [wishlists]="wishlists" [settings]="settings" (updateSettings)="updateSettings($event)"></ish-account-wishlist-list>
 */
@Component({
  selector: 'ish-account-wishlist-list',
  templateUrl: './account-wishlist-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistListComponent implements OnChanges {
  /**
   * The list of wishlists of the customer.
   */
  @Input() wishlists: Wishlist[];
  /**
   * Emits the id of the wishlist, which is to be deleted.
   */
  @Output() deleteWishlist = new EventEmitter<string>();

  /** The header text of the delete modal. */
  deleteHeader: string;
  preferredWishlist: Wishlist;

  constructor(private translate: TranslateService) {}

  ngOnChanges() {
    // determine preferred wishlist
    if (this.wishlists && this.wishlists.length) {
      this.preferredWishlist = this.wishlists.find(wishlist => wishlist.preferred);
    } else {
      this.preferredWishlist = undefined;
    }
  }

  /** Emits the id of the wishlist to delete. */
  delete(wishlistId: string) {
    this.deleteWishlist.emit(wishlistId);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(wishlist: Wishlist, modal: ModalDialogComponent) {
    this.translate
      .get('account.wishlists.delete_wishlist_dialog.header', { 0: wishlist.title })
      .pipe(take(1))
      .subscribe(res => (modal.options.titleText = res));

    modal.show(wishlist.id);
  }
}
