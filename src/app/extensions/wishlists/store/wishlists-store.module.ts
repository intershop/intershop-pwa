import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { WishlistEffects } from './wishlist/wishlist.effects';
import { wishlistReducer } from './wishlist/wishlist.reducer';
import { WishlistsState } from './wishlists-store';

const wishlistsReducers: ActionReducerMap<WishlistsState> = {
  wishlists: wishlistReducer,
};

const wishlistsEffects = [WishlistEffects];

@Injectable()
export class WishlistStoreConfig implements StoreConfig<WishlistsState> {
  metaReducers = [resetOnLogoutMeta];
}

export const WISHLIST_STORE_CONFIG = new InjectionToken<StoreConfig<WishlistsState>>('wishlistStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(wishlistsEffects),
    StoreModule.forFeature('wishlists', wishlistsReducers, WISHLIST_STORE_CONFIG),
  ],
  providers: [{ provide: WISHLIST_STORE_CONFIG, useClass: WishlistStoreConfig }],
})
export class WishlistsStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<WishlistsState>)[]) {
    return StoreModule.forFeature('wishlists', pick(wishlistsReducers, reducers));
  }
}
