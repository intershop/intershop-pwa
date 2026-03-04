import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideQuotingFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'quoting',
        providers: () => import('./store/quoting-store.module').then(m => importProvidersFrom(m.QuotingStoreModule)),
      },
      multi: true,
    },
  ];
}

export const QUOTING_FEATURE_PROVIDERS = provideQuotingFeature();
