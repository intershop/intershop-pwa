import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provideStoreLocatorFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'storeLocator',
        loadStrategy: 'onDemand',
        providers: () => import('./store/store-locator-store.providers').then(m => m.provideStoreLocatorStore()),
      },
      multi: true,
    },
  ];
}

export const STORE_LOCATOR_FEATURE_PROVIDERS = provideStoreLocatorFeature();
