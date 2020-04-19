import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { WishlistEffects } from './wishlist/wishlist.effects';
import { wishlistReducer } from './wishlist/wishlist.reducer';
import { WishlistsState } from './wishlists-store';

/** @deprecated will be made private in version 0.23 */
export const wishlistsReducers: ActionReducerMap<WishlistsState> = {
  wishlists: wishlistReducer,
};
// tslint:disable: deprecation

const wishlistsEffects = [WishlistEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(wishlistsEffects), StoreModule.forFeature('wishlists', wishlistsReducers)],
})
export class WishlistsStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<WishlistsState>)[]) {
    return StoreModule.forFeature('wishlists', pick(wishlistsReducers, reducers));
  }
}
