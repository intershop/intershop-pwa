import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideSeoFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'always',
        loadStrategy: 'appInit',
        providers: () => import('./store/seo-store.providers').then(m => m.provideSeoStore()),
      },
      multi: true,
    },
  ];
}

export const SEO_FEATURE_PROVIDERS = provideSeoFeature();
