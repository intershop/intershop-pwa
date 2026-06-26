import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

export function provideSeoFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'always',
        providers: () => import('./store/seo-store.providers').then(m => m.provideSeoStore()),
      },
      multi: true,
    },
  ];
}

export const SEO_FEATURE_PROVIDERS = provideSeoFeature();
