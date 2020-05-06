import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { WishlistEffects } from './wishlist/wishlist.effects';
import { wishlistReducer } from './wishlist/wishlist.reducer';
import { WishlistsState } from './wishlists-store';

export const wishlistsReducers: ActionReducerMap<WishlistsState> = {
  wishlists: wishlistReducer,
};

const wishlistsEffects = [WishlistEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(wishlistsEffects), StoreModule.forFeature('wishlists', wishlistsReducers)],
})
export class WishlistsStoreModule {}
