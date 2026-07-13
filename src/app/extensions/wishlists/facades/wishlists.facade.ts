import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { WishlistSharing } from '../models/wishlist-sharing/wishlist-sharing.model';
import { Wishlist, WishlistHeader } from '../models/wishlist/wishlist.model';
import {
  addProductToNewWishlist,
  addProductToWishlist,
  createWishlist,
  deleteWishlist,
  getAllWishlists,
  getAllWishlistsItemsSkus,
  getPreferredWishlist,
  getSelectedWishlistDetails,
  getSharedWishlist,
  getWishlistDetails,
  getWishlistsError,
  getWishlistsLoading,
  moveItemToWishlist,
  removeItemFromWishlist,
  updateWishlist,
  wishlistActions,
} from '../store/wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistsFacade {
  constructor(private store: Store) {}

  wishlists$: Observable<Wishlist[]> = this.store.pipe(select(getAllWishlists));
  currentWishlist$: Observable<Wishlist> = this.store.pipe(select(getSelectedWishlistDetails));
  preferredWishlist$: Observable<Wishlist> = this.store.pipe(select(getPreferredWishlist));
  wishlistLoading$: Observable<boolean> = this.store.pipe(select(getWishlistsLoading));
  wishlistError$: Observable<HttpError> = this.store.pipe(select(getWishlistsError));
  sharedWishlist$: Observable<Wishlist> = this.store.pipe(select(getSharedWishlist));

  /**
   * Emits the unique product SKUs of wishlist items and triggers loading the item details
   * of wishlists whose details have not been loaded yet.
   * If a `wishlistId` is given, only that wishlist is considered, otherwise all wishlists are used.
   */
  wishlistItemsSkus$(wishlistId?: string): Observable<string[]> {
    if (wishlistId) {
      return this.store.pipe(
        select(getWishlistDetails(wishlistId)),
        tap(wishlist => this.loadMissingWishlistDetails(wishlist ? [wishlist] : [])),
        map(wishlist => wishlist?.items?.map(item => item.sku) ?? [])
      );
    }
    return this.wishlists$.pipe(
      tap(wishlists => this.loadMissingWishlistDetails(wishlists)),
      switchMap(() => this.store.pipe(select(getAllWishlistsItemsSkus)))
    );
  }

  wishlistSelectOptions$(filterCurrent = true) {
    return this.wishlists$.pipe(
      startWith([] as Wishlist[]),
      map(wishlists =>
        wishlists.map(wishlist => ({
          value: wishlist.id,
          label: wishlist.title,
        }))
      ),
      withLatestFrom(this.currentWishlist$),
      map(([wishlistOptions, currentWishlist]) => {
        if (filterCurrent && currentWishlist) {
          return wishlistOptions.filter(option => option.value !== currentWishlist.id);
        }
        return wishlistOptions;
      })
    );
  }

  addWishlist(wishlist: WishlistHeader): HttpError | void {
    this.store.dispatch(createWishlist({ wishlist }));
  }

  deleteWishlist(id: string): void {
    this.store.dispatch(deleteWishlist({ wishlistId: id }));
  }

  updateWishlist(wishlist: Wishlist): void {
    this.store.dispatch(updateWishlist({ wishlist }));
  }

  addProductToNewWishlist(title: string, sku: string): void {
    this.store.dispatch(addProductToNewWishlist({ title, sku }));
  }

  addProductToWishlist(wishlistId: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToWishlist({ wishlistId, sku, quantity }));
  }

  moveItemToWishlist(sourceWishlistId: string, targetWishlistId: string, sku: string): void {
    this.store.dispatch(
      moveItemToWishlist({ source: { id: sourceWishlistId }, target: { id: targetWishlistId, sku } })
    );
  }

  moveItemToNewWishlist(sourceWishlistId: string, title: string, sku: string): void {
    this.store.dispatch(moveItemToWishlist({ source: { id: sourceWishlistId }, target: { title, sku } }));
  }

  removeProductFromWishlist(wishlistId: string, sku: string): void {
    this.store.dispatch(removeItemFromWishlist({ wishlistId, sku }));
  }

  shareWishlist(wishlistId: string, wishlistSharing: WishlistSharing): void {
    this.store.dispatch(wishlistActions.shareWishlist({ wishlistId, wishlistSharing }));
  }

  unshareWishlist(wishlistId: string): void {
    this.store.dispatch(wishlistActions.unshareWishlist({ wishlistId }));
  }

  private loadMissingWishlistDetails(wishlists: Wishlist[]): void {
    // only wishlists without a loaded items attribute need their details fetched
    const wishlistIds = wishlists.filter(wishlist => !wishlist.items).map(wishlist => wishlist.id);
    if (wishlistIds.length) {
      this.store.dispatch(wishlistActions.loadWishlistDetails({ wishlistIds }));
    }
  }
}
