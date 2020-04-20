import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Wishlist, WishlistHeader } from '../models/wishlist/wishlist.model';
import {
  AddProductToNewWishlist,
  AddProductToWishlist,
  CreateWishlist,
  DeleteWishlist,
  MoveItemToWishlist,
  RemoveItemFromWishlist,
  UpdateWishlist,
  getAllWishlists,
  getAllWishlistsItemsSkus,
  getPreferredWishlist,
  getSelectedWishlistDetails,
  getWishlistsError,
  getWishlistsLoading,
} from '../store/wishlist';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class WishlistsFacade {
  constructor(private store: Store<{}>) {}

  wishlists$: Observable<Wishlist[]> = this.store.pipe(select(getAllWishlists));
  currentWishlist$: Observable<Wishlist> = this.store.pipe(select(getSelectedWishlistDetails));
  preferredWishlist$: Observable<Wishlist> = this.store.pipe(select(getPreferredWishlist));
  allWishlistsItemsSkus$: Observable<string[]> = this.store.pipe(select(getAllWishlistsItemsSkus));
  wishlistLoading$: Observable<boolean> = this.store.pipe(select(getWishlistsLoading));
  wishlistError$: Observable<HttpError> = this.store.pipe(select(getWishlistsError));

  addWishlist(wishlist: WishlistHeader): void | HttpError {
    this.store.dispatch(new CreateWishlist({ wishlist }));
  }

  deleteWishlist(id: string): void {
    this.store.dispatch(new DeleteWishlist({ wishlistId: id }));
  }

  updateWishlist(wishlist: Wishlist): void {
    this.store.dispatch(new UpdateWishlist({ wishlist }));
  }

  addProductToNewWishlist(title: string, sku: string): void {
    this.store.dispatch(new AddProductToNewWishlist({ title, sku }));
  }

  addProductToWishlist(wishlistId: string, sku: string, quantity?: number): void {
    this.store.dispatch(new AddProductToWishlist({ wishlistId, sku, quantity }));
  }

  moveItemToWishlist(sourceWishlistId: string, targetWishlistId: string, sku: string): void {
    this.store.dispatch(
      new MoveItemToWishlist({ source: { id: sourceWishlistId }, target: { id: targetWishlistId, sku } })
    );
  }

  moveItemToNewWishlist(sourceWishlistId: string, title: string, sku: string): void {
    this.store.dispatch(new MoveItemToWishlist({ source: { id: sourceWishlistId }, target: { title, sku } }));
  }

  removeProductFromWishlist(wishlistId: string, sku: string): void {
    this.store.dispatch(new RemoveItemFromWishlist({ wishlistId, sku }));
  }
}
