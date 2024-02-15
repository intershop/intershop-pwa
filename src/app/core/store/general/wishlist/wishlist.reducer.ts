import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Wishlist } from 'ish-core/models/wishlist/wishlist.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { loadWishlist, loadWishlistFail, loadWishlistSuccess } from './wishlist.actions';

export interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: HttpError;
}

const initialState: WishlistState = {
  wishlist: undefined,
  loading: false,
  error: undefined,
};

export const wishlistReducer = createReducer(
  initialState,
  setLoadingOn(loadWishlist),
  setErrorOn(loadWishlistFail),
  unsetLoadingAndErrorOn(loadWishlistSuccess),
  on(
    loadWishlistSuccess,
    (state, wishlist): WishlistState => ({
      ...state,
      wishlist: wishlist.payload.wishlist,
    })
  )
);
