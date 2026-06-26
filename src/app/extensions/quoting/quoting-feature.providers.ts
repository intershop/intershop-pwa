import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provideQuotingFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'quoting',
        providers: () => import('./store/quoting-store.providers').then(m => m.provideQuotingStore()),
      },
      multi: true,
    },
  ];
}

export const QUOTING_FEATURE_PROVIDERS = provideQuotingFeature();
