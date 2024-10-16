import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { Wishlist } from '../../models/wishlist/wishlist.model';

import {
  addProductToWishlistSuccess,
  createWishlist,
  createWishlistFail,
  createWishlistSuccess,
  deleteWishlist,
  deleteWishlistFail,
  deleteWishlistSuccess,
  loadWishlists,
  loadWishlistsFail,
  loadWishlistsSuccess,
  moveItemToWishlist,
  removeItemFromWishlist,
  removeItemFromWishlistSuccess,
  selectWishlist,
  updateWishlist,
  updateWishlistFail,
  updateWishlistSuccess,
  wishlistActions,
  wishlistApiActions,
} from './wishlist.actions';

export interface WishlistState extends EntityState<Wishlist> {
  loading: boolean;
  selected: string;
  error: HttpError;
  sharedWishlist: Wishlist;
  sharedWishlistLoading: boolean;
  sharedWishlistError: HttpError;
}

export const wishlistsAdapter = createEntityAdapter<Wishlist>({
  selectId: wishlist => wishlist.id,
});

export const initialState: WishlistState = wishlistsAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
  sharedWishlist: undefined,
  sharedWishlistLoading: false,
  sharedWishlistError: undefined,
});

export const wishlistReducer = createReducer(
  initialState,
  setLoadingOn(
    loadWishlists,
    wishlistActions.loadSharedWishlist,
    createWishlist,
    deleteWishlist,
    updateWishlist,
    removeItemFromWishlist,
    moveItemToWishlist
  ),
  setErrorOn(
    loadWishlistsFail,
    wishlistApiActions.loadSharedWishlistFail,
    deleteWishlistFail,
    createWishlistFail,
    updateWishlistFail,
    wishlistApiActions.shareWishlistFail,
    wishlistApiActions.unshareWishlistFail
  ),
  unsetLoadingAndErrorOn(
    updateWishlistSuccess,
    addProductToWishlistSuccess,
    removeItemFromWishlistSuccess,
    createWishlistSuccess,
    loadWishlistsSuccess,
    wishlistApiActions.loadSharedWishlistSuccess,
    deleteWishlistSuccess
  ),
  on(
    loadWishlistsFail,
    deleteWishlistFail,
    createWishlistFail,
    updateWishlistFail,
    (state: WishlistState): WishlistState => ({
      ...state,
      selected: undefined as string,
    })
  ),
  on(loadWishlistsSuccess, (state: WishlistState, action) => {
    const { wishlists } = action.payload;
    return wishlistsAdapter.setAll(wishlists, state);
  }),
  on(
    updateWishlistSuccess,
    wishlistApiActions.loadSharedWishlistSuccess,
    addProductToWishlistSuccess,
    removeItemFromWishlistSuccess,
    createWishlistSuccess,
    (state, action) => {
      const { wishlist } = action.payload;

      return wishlistsAdapter.upsertOne(wishlist, state);
    }
  ),
  on(deleteWishlistSuccess, (state, action) => {
    const { wishlistId } = action.payload;
    return wishlistsAdapter.removeOne(wishlistId, state);
  }),
  on(selectWishlist, wishlistActions.loadSharedWishlist, (state, action): WishlistState => {
    const { wishlistId: id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  }),
  on(wishlistApiActions.shareWishlistSuccess, (state, action): WishlistState => {
    const wishlistSharingResponse = action.payload.wishlistSharingResponse;
    const wishlistId = wishlistSharingResponse.wishlistId;

    const updatedWishlist: Wishlist = {
      ...state.entities[wishlistId],
      shared: true,
      owner: wishlistSharingResponse.owner,
      secureCode: wishlistSharingResponse.secureCode,
    };

    return wishlistsAdapter.upsertOne(updatedWishlist, state);
  }),
  on(wishlistApiActions.unshareWishlistSuccess, (state, action): WishlistState => {
    const wishlistId = action.payload.wishlistId;

    const updatedWishlist: Wishlist = {
      ...state.entities[wishlistId],
      shared: false,
      secureCode: undefined,
    };

    return wishlistsAdapter.upsertOne(updatedWishlist, state);
  }),
  on(
    wishlistApiActions.loadSharedWishlistSuccess,
    (state, action): WishlistState => ({
      ...state,
      sharedWishlist: action.payload.wishlist,
      sharedWishlistLoading: false,
    })
  ),
  on(
    wishlistApiActions.loadSharedWishlistFail,
    (state, action): WishlistState => ({
      ...state,
      sharedWishlistLoading: false,
      sharedWishlistError: action.payload.error,
    })
  )
);
