import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule, provideState } from '@ngrx/store';
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

const wishlistsStoreProviders = [{ provide: WISHLIST_STORE_CONFIG, useClass: WishlistStoreConfig }];

export function provideWishlistsStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState('wishlists', wishlistsReducers, WISHLIST_STORE_CONFIG),
    provideEffects(wishlistsEffects),
    ...wishlistsStoreProviders,
  ]);
}

export class WishlistsStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<WishlistsState>)[]) {
    return StoreModule.forFeature('wishlists', pick(wishlistsReducers, reducers));
  }
}
