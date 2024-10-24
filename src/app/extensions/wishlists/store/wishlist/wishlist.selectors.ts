import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { uniq } from 'lodash-es';

import { isArrayEqual } from 'ish-core/utils/functions';

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

/**
 * Gets all unique items from all wishlists
 * Returns an array of the wishlist item product SKUs
 */
export const getAllWishlistsItemsSkus = createSelectorFactory<object, string[]>(projector =>
  resultMemoize(projector, isArrayEqual)
)(getAllWishlists, (wishlists: Wishlist[]): string[] =>
  uniq(wishlists.map(wishlist => wishlist.items.map(items => items.sku)).flat())
);

export const getSharedWishlist = createSelector(getWishlistState, (state: WishlistState) => state.sharedWishlist);

export const getSharedWishlistLoading = createSelector(
  getWishlistState,
  (state: WishlistState) => state.sharedWishlistLoading
);

export const getSharedWishlistError = createSelector(
  getWishlistState,
  (state: WishlistState) => state.sharedWishlistError
);

export const isSharedWishlistLoading = (wishlistId: string) =>
  createSelector(getWishlistState, (state: WishlistState) => state.loading && state.selected === wishlistId);

export const isSharedWishlistLoaded = (wishlistId: string) =>
  createSelector(selectEntities, entities => !!entities[wishlistId]);
