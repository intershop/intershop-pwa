import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideWishlistsFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'wishlists',
        providers: () =>
          import('./store/wishlists-store.module').then(m => importProvidersFrom(m.WishlistsStoreModule)),
      },
      multi: true,
    },
  ];
}

export const WISHLISTS_FEATURE_PROVIDERS = provideWishlistsFeature();
