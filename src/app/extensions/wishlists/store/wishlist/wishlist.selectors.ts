import { createSelector } from '@ngrx/store';

import { Wishlist } from '../../models/wishlist/wishlist.model';
import { getWishlistsState } from '../wishlists-store';

import { initialState, wishlistsAdapter } from './wishlist.reducer';

const getWishlistState = createSelector(
  getWishlistsState,
  state => (state ? state.wishlists : initialState)
);

export const { selectEntities: getWishlistEntities, selectAll: getAllWishlists } = wishlistsAdapter.getSelectors(
  getWishlistState
);

export const getWishlistsLoading = createSelector(
  getWishlistState,
  state => state.loading
);

export const getWishlistsError = createSelector(
  getWishlistState,
  state => state.error
);
export const getSelectedWishlistId = createSelector(
  getWishlistState,
  state => state.selected
);

export const getSelectedWishlistDetails = createSelector(
  getWishlistEntities,
  getSelectedWishlistId,
  (entities, id): Wishlist => id && entities[id]
);

export const getWishlistDetails = createSelector(
  getWishlistEntities,
  (entities, props: { id: string }): Wishlist => props.id && entities[props.id]
);

export const getPreferredWishlist = createSelector(
  getAllWishlists,
  entities => entities.find(e => e.preferred)
);
