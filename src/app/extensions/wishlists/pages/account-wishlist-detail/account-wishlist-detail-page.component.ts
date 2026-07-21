import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistSharing } from '../../models/wishlist-sharing/wishlist-sharing.model';
import { Wishlist, WishlistItem } from '../../models/wishlist/wishlist.model';
import { SelectWishlistModalComponent } from '../../shared/select-wishlist-modal/select-wishlist-modal.component';

@Component({
  selector: 'ish-account-wishlist-detail-page',
  standalone: false,
  templateUrl: './account-wishlist-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistDetailPageComponent implements OnInit {
  wishlist$: Observable<Wishlist>;
  wishlistError$: Observable<HttpError>;
  wishlistLoading$: Observable<boolean>;

  @ViewChild('moveDialog') moveDialog: SelectWishlistModalComponent;

  private currentWishlist: Wishlist;
  moveItem: WishlistItem;

  private destroyRef = inject(DestroyRef);

  constructor(private wishlistsFacade: WishlistsFacade) {}

  ngOnInit() {
    this.wishlist$ = this.wishlistsFacade.currentWishlist$;
    this.wishlistLoading$ = this.wishlistsFacade.wishlistLoading$;
    this.wishlistError$ = this.wishlistsFacade.wishlistError$;

    this.wishlist$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(wishlist => {
      this.currentWishlist = wishlist;
      this.moveItem = undefined;
    });
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

  showMoveDialog(wishlistItemId: string) {
    this.moveItem = this.currentWishlist.items.find(item => item.id === wishlistItemId);
    if (this.moveItem) {
      this.moveDialog.show();
    }
  }

  moveItemToOtherWishlist(wishlistMoveData: { id: string; title: string }) {
    if (wishlistMoveData.id) {
      this.wishlistsFacade.moveItemToWishlist(this.currentWishlist.id, wishlistMoveData.id, this.moveItem.sku);
    } else {
      this.wishlistsFacade.moveItemToNewWishlist(this.currentWishlist.id, wishlistMoveData.title, this.moveItem.sku);
    }
  }
}
