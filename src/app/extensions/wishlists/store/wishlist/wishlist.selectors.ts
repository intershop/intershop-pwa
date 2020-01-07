import { createSelector } from '@ngrx/store';

import { getWishlistsState } from '../wishlists-store';

import { initialState, wishlistsAdapter } from './wishlist.reducer';

const getWishlistState = createSelector(
  getWishlistsState,
  state => (state ? state.wishlists : initialState)
);

export const { selectEntities: getWishlistEntitites, selectAll: getAllWishlists } = wishlistsAdapter.getSelectors(
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
  getAllWishlists,
  getSelectedWishlistId,
  (entities, id) => entities.find(e => e.id === id)
);

export const getPreferredWishlist = createSelector(
  getAllWishlists,
  entities => entities.find(e => e.preferred)
);
