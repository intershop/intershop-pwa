import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators';

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
  getWishlistsError,
  getWishlistsLoading,
  loadSharedWishlist,
  moveItemToWishlist,
  removeItemFromWishlist,
  shareWishlist,
  unshareWishlist,
  updateWishlist,
} from '../store/wishlist';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class WishlistsFacade {
  constructor(private store: Store) {}

  wishlists$: Observable<Wishlist[]> = this.store.pipe(select(getAllWishlists));
  currentWishlist$: Observable<Wishlist> = this.store.pipe(select(getSelectedWishlistDetails));
  preferredWishlist$: Observable<Wishlist> = this.store.pipe(select(getPreferredWishlist));
  allWishlistsItemsSkus$: Observable<string[]> = this.store.pipe(select(getAllWishlistsItemsSkus));
  wishlistLoading$: Observable<boolean> = this.store.pipe(select(getWishlistsLoading));
  wishlistError$: Observable<HttpError> = this.store.pipe(select(getWishlistsError));

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

  addWishlist(wishlist: WishlistHeader): void | HttpError {
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
    this.store.dispatch(shareWishlist({ wishlistId, wishlistSharing }));
  }

  unshareWishlist(wishlistId: string): void {
    this.store.dispatch(unshareWishlist({ wishlistId }));
  }

  loadSharedWishlist(id: string, owner: string, secureCode: string) {
    this.store.dispatch(loadSharedWishlist({ id, owner, secureCode }));
  }
}
