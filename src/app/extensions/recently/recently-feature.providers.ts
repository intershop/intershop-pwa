import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideRecentlyFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'recently',
        providers: () => import('./store/recently-store.module').then(m => importProvidersFrom(m.RecentlyStoreModule)),
      },
      multi: true,
    },
  ];
}

export const RECENTLY_FEATURE_PROVIDERS = provideRecentlyFeature();
