import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { WishlistEffects } from './wishlist/wishlist.effects';
import { wishlistReducer } from './wishlist/wishlist.reducer';
import { WishlistsState } from './wishlists-store';

const wishlistsReducers: ActionReducerMap<WishlistsState> = {
  wishlists: wishlistReducer,
};

const wishlistsEffects = [WishlistEffects];

const metaReducers = [resetOnLogoutMeta];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(wishlistsEffects),
    StoreModule.forFeature('wishlists', wishlistsReducers, { metaReducers }),
  ],
})
export class WishlistsStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<WishlistsState>)[]) {
    return StoreModule.forFeature('wishlists', pick(wishlistsReducers, reducers), { metaReducers });
  }
}
