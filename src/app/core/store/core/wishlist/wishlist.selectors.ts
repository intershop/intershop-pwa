import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core/core-store';

const getWishlistState = createSelector(getCoreState, state => state.wishlist);

export const getWishlist = createSelector(getWishlistState, state => state.wishlist);

export const getWishlistLoading = createSelector(getWishlistState, state => state.loading);

export const getWishlistError = createSelector(getWishlistState, state => state.error);
