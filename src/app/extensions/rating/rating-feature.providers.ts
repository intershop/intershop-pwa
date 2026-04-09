import { EnvironmentProviders, Provider } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

export function provideRatingFeature(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'rating',
        providers: () => import('./store/product-review-store.providers').then(m => m.provideProductReviewStore()),
      },
      multi: true,
    },
  ];
}

export const RATING_FEATURE_PROVIDERS = provideRatingFeature();
