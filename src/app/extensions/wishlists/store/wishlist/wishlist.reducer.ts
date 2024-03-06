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
  loadSharedWishlist,
  loadSharedWishlistFail,
  loadSharedWishlistSuccess,
  loadWishlists,
  loadWishlistsFail,
  loadWishlistsSuccess,
  moveItemToWishlist,
  removeItemFromWishlist,
  removeItemFromWishlistSuccess,
  selectWishlist,
  shareWishlistSuccess,
  unshareWishlistSuccess,
  updateWishlist,
  updateWishlistFail,
  updateWishlistSuccess,
} from './wishlist.actions';

export interface WishlistState extends EntityState<Wishlist> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const wishlistsAdapter = createEntityAdapter<Wishlist>({
  selectId: wishlist => wishlist.id,
});

export const initialState: WishlistState = wishlistsAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const wishlistReducer = createReducer(
  initialState,
  setLoadingOn(
    loadWishlists,
    loadSharedWishlist,
    createWishlist,
    deleteWishlist,
    updateWishlist,
    removeItemFromWishlist,
    moveItemToWishlist
  ),
  setErrorOn(loadWishlistsFail, loadSharedWishlistFail, deleteWishlistFail, createWishlistFail, updateWishlistFail),
  unsetLoadingAndErrorOn(
    updateWishlistSuccess,
    addProductToWishlistSuccess,
    removeItemFromWishlistSuccess,
    createWishlistSuccess,
    loadWishlistsSuccess,
    loadSharedWishlistSuccess,
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
  on(selectWishlist, loadSharedWishlist, (state, action): WishlistState => {
    const { id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  }),
  on(shareWishlistSuccess, (state, action): WishlistState => {
    const wishlistSharingResponse = action.payload.wishlistSharingResponse;
    const wishlistId = wishlistSharingResponse.wishlistId;

    const updatedWishlist: Wishlist = {
      ...state.entities[wishlistId],
      shared: true,
      owner: wishlistSharingResponse.owner,
      secureCode: wishlistSharingResponse.secureCode,
    };

    return {
      ...state,
      entities: {
        ...state.entities,
        [wishlistId]: updatedWishlist,
      },
    };
  }),
  on(unshareWishlistSuccess, (state, action): WishlistState => {
    const wishlistId = action.payload.wishlistId;

    const updatedWishlist: Wishlist = {
      ...state.entities[wishlistId],
      shared: false,
    };

    return {
      ...state,
      entities: {
        ...state.entities,
        [wishlistId]: updatedWishlist,
      },
    };
  }),
  on(loadSharedWishlistSuccess, (state, action): WishlistState => {
    const wishlist = action.payload.wishlist;
    const wishlistId = wishlist.id;

    return {
      ...state,
      entities: {
        ...state.entities,
        [wishlistId]: {
          ...wishlist,
        },
      },
    };
  })
);
