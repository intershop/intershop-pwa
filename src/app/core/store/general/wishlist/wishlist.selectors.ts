import { createSelector } from '@ngrx/store';

import { getGeneralState } from 'ish-core/store/general/general-store';

const getWishlistState = createSelector(getGeneralState, state => state.wishlist);

export const getWishlist = createSelector(getWishlistState, state => state.wishlist);

export const getWishlistLoading = createSelector(getWishlistState, state => state.loading);

export const getWishlistError = createSelector(getWishlistState, state => state.error);
