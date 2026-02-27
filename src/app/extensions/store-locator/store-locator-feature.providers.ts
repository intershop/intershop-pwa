import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideStoreLocatorFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'storeLocator',
        providers: () =>
          import('./store/store-locator-store.module').then(m => importProvidersFrom(m.StoreLocatorStoreModule)),
      },
      multi: true,
    },
  ];
}

export const STORE_LOCATOR_FEATURE_PROVIDERS = provideStoreLocatorFeature();
