import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideRecentlyFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'recently',
        providers: () => import('./store/recently-store.providers').then(m => m.provideRecentlyStore()),
      },
      multi: true,
    },
  ];
}

export const RECENTLY_FEATURE_PROVIDERS = provideRecentlyFeature();
