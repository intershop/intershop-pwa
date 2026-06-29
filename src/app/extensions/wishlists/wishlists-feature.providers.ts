import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provideWishlistsFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'wishlists',
        providers: () => import('./store/wishlists-store.providers').then(m => m.provideWishlistsStore()),
      },
      multi: true,
    },
  ];
}

export const WISHLISTS_FEATURE_PROVIDERS = provideWishlistsFeature();
