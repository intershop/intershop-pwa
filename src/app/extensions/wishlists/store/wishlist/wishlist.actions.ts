import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';

export const loadWishlists = createAction('[Wishlist Internal] Load Wishlists');

export const loadWishlistsSuccess = createAction(
  '[Wishlist API] Load Wishlists Success',
  payload<{ wishlists: Wishlist[] }>()
);

export const loadWishlistsFail = createAction('[Wishlist API] Load Wishlists Fail', httpError());

export const createWishlist = createAction('[Wishlist] Create Wishlist', payload<{ wishlist: WishlistHeader }>());

export const createWishlistSuccess = createAction(
  '[Wishlist API] Create Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const createWishlistFail = createAction('[Wishlist API] Create Wishlist Fail', httpError());

export const updateWishlist = createAction('[Wishlist] Update Wishlist', payload<{ wishlist: Wishlist }>());

export const updateWishlistSuccess = createAction(
  '[Wishlist API] Update Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const updateWishlistFail = createAction('[Wishlist API] Update Wishlist Fail', httpError());

export const deleteWishlist = createAction('[Wishlist] Delete Wishlist', payload<{ wishlistId: string }>());

export const deleteWishlistSuccess = createAction(
  '[Wishlist API] Delete Wishlist Success',
  payload<{ wishlistId: string }>()
);

export const deleteWishlistFail = createAction('[Wishlist API] Delete Wishlist Fail', httpError());

export const addProductToWishlist = createAction(
  '[Wishlist] Add Item to Wishlist',
  payload<{ wishlistId: string; sku: string; quantity?: number }>()
);

export const addProductToWishlistSuccess = createAction(
  '[Wishlist API] Add Item to Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const addProductToWishlistFail = createAction('[Wishlist API] Add Item to Wishlist Fail', httpError());

export const addProductToNewWishlist = createAction(
  '[Wishlist Internal] Add Product To New Wishlist',
  payload<{ title: string; sku: string }>()
);

export const moveItemToWishlist = createAction(
  '[Wishlist] Move Item to another Wishlist',
  payload<{ source: { id: string }; target: { id?: string; title?: string; sku: string } }>()
);

export const removeItemFromWishlist = createAction(
  '[Wishlist] Remove Item from Wishlist',
  payload<{ wishlistId: string; sku: string }>()
);

export const removeItemFromWishlistSuccess = createAction(
  '[Wishlist API] Remove Item from Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const removeItemFromWishlistFail = createAction('[Wishlist API] Remove Item from Wishlist Fail', httpError());

export const selectWishlist = createAction('[Wishlist Internal] Select Wishlist', payload<{ id: string }>());
