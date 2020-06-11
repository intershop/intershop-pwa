import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';

export const loadWishlists = createAction('[Wishlists Internal] Load Wishlists');

export const loadWishlistsSuccess = createAction(
  '[Wishlists API] Load Wishlists Success',
  payload<{ wishlists: Wishlist[] }>()
);

export const loadWishlistsFail = createAction('[Wishlists API] Load Wishlists Fail', httpError());

export const createWishlist = createAction('[Wishlists] Create Wishlist', payload<{ wishlist: WishlistHeader }>());

export const createWishlistSuccess = createAction(
  '[Wishlists API] Create Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const createWishlistFail = createAction('[Wishlists API] Create Wishlist Fail', httpError());

export const updateWishlist = createAction('[Wishlists] Update Wishlist', payload<{ wishlist: Wishlist }>());

export const updateWishlistSuccess = createAction(
  '[Wishlists API] Update Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const updateWishlistFail = createAction('[Wishlists API] Update Wishlist Fail', httpError());

export const deleteWishlist = createAction('[Wishlists] Delete Wishlist', payload<{ wishlistId: string }>());

export const deleteWishlistSuccess = createAction(
  '[Wishlists API] Delete Wishlist Success',
  payload<{ wishlistId: string }>()
);

export const deleteWishlistFail = createAction('[Wishlists API] Delete Wishlist Fail', httpError());

export const addProductToWishlist = createAction(
  '[Wishlists] Add Item to Wishlist',
  payload<{ wishlistId: string; sku: string; quantity?: number }>()
);

export const addProductToWishlistSuccess = createAction(
  '[Wishlists API] Add Item to Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const addProductToWishlistFail = createAction('[Wishlists API] Add Item to Wishlist Fail', httpError());

export const addProductToNewWishlist = createAction(
  '[Wishlists Internal] Add Product To New Wishlist',
  payload<{ title: string; sku: string }>()
);

export const moveItemToWishlist = createAction(
  '[Wishlists] Move Item to another Wishlist',
  payload<{ source: { id: string }; target: { id?: string; title?: string; sku: string } }>()
);

export const removeItemFromWishlist = createAction(
  '[Wishlists] Remove Item from Wishlist',
  payload<{ wishlistId: string; sku: string }>()
);

export const removeItemFromWishlistSuccess = createAction(
  '[Wishlists API] Remove Item from Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const removeItemFromWishlistFail = createAction('[Wishlists API] Remove Item from Wishlist Fail', httpError());

export const selectWishlist = createAction('[Wishlists Internal] Select Wishlist', payload<{ id: string }>());
