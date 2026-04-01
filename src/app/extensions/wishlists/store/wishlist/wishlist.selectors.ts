import { createSelector } from '@ngrx/store';

import { Wishlist } from '../../models/wishlist/wishlist.model';
import { getWishlistsState } from '../wishlists-store';

import { WishlistState, initialState, wishlistsAdapter } from './wishlist.reducer';

const getWishlistState = createSelector(getWishlistsState, state => (state ? state.wishlists : initialState));

const { selectEntities, selectAll } = wishlistsAdapter.getSelectors(getWishlistState);

export const getAllWishlists = selectAll;

export const getWishlistsLoading = createSelector(getWishlistState, state => state.loading);

export const getWishlistsError = createSelector(getWishlistState, state => state.error);

export const getSelectedWishlistId = createSelector(getWishlistState, state => state.selected);

export const getSelectedWishlistDetails = createSelector(
  selectEntities,
  getSelectedWishlistId,
  (entities, id): Wishlist => id && entities[id]
);

export const getWishlistDetails = (id: string) => createSelector(selectEntities, entities => entities[id]);

export const getPreferredWishlist = createSelector(getAllWishlists, entities => entities.find(e => e.preferred));

export const getSharedWishlist = createSelector(getWishlistState, (state: WishlistState) => state.sharedWishlist);
