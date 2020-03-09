import { WishlistState } from './wishlist/wishlist.reducer';

export interface WishlistsState {
  wishlists: WishlistState;
}

// TODO: use createFeatureSelector after ivy dynamic loading
// tslint:disable-next-line: no-any
export const getWishlistsState: (state: any) => WishlistsState = state => state.wishlists;
