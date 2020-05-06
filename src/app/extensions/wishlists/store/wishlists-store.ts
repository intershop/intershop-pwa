import { createFeatureSelector } from '@ngrx/store';

import { WishlistState } from './wishlist/wishlist.reducer';

export interface WishlistsState {
  wishlists: WishlistState;
}

export const getWishlistsState = createFeatureSelector<WishlistsState>('wishlists');
