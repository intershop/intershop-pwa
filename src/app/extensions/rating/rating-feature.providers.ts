import { EnvironmentProviders, Provider } from '@angular/core';
import { ConfigOption, provideFormlyConfig } from '@ngx-formly/core';

import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

import { RatingStarsFieldComponent } from './formly/rating-stars-field/rating-stars-field.component';

const ratingFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-rating-stars-field',
      component: RatingStarsFieldComponent,
      wrappers: ['form-field-horizontal', 'validation'],
    },
  ],
};

export function provideRatingFeature(): (EnvironmentProviders | Provider)[] {
  return [
    provideFormlyConfig(ratingFormlyConfig),
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'rating',
        providers: () => import('./store/product-review-store.providers').then(m => m.provideProductReviewStore()),
      },
      multi: true,
    },
  ];
}

export const RATING_FEATURE_PROVIDERS = provideRatingFeature();
