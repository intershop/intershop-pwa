import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideSeoFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'always',
        providers: () => import('./store/seo-store.module').then(m => importProvidersFrom(m.SeoStoreModule)),
      },
      multi: true,
    },
  ];
}

export const SEO_FEATURE_PROVIDERS = provideSeoFeature();
