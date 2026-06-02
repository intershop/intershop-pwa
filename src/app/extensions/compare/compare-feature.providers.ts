import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideCompareFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      multi: true,
      useValue: {
        feature: 'compare',
        providers: () => import('./store/compare-store.providers').then(m => m.provideCompareStore()),
      },
    },
  ];
}

export const COMPARE_FEATURE_PROVIDERS = provideCompareFeature();
