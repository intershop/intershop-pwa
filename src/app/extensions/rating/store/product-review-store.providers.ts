import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule, provideState } from '@ngrx/store';
import { pick } from 'lodash-es';

import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { resetSubStatesOnActionsMeta } from 'ish-core/utils/meta-reducers';

import { ProductReviewState } from './product-review-store';
import { ProductReviewsEffects } from './product-reviews/product-reviews.effects';
import { productReviewsReducer } from './product-reviews/product-reviews.reducer';

const productReviewReducers: ActionReducerMap<ProductReviewState> = { productReviews: productReviewsReducer };

const productReviewsEffects = [ProductReviewsEffects];

@Injectable()
export class ReviewsStoreConfig implements StoreConfig<ProductReviewState> {
  metaReducers = [
    resetSubStatesOnActionsMeta<ProductReviewState>(['productReviews'], [personalizationStatusDetermined]),
  ];
}

export const PRODUCT_REVIEW_STORE_CONFIG = new InjectionToken<StoreConfig<ProductReviewState>>(
  'productReviewStoreConfig'
);

const productReviewStoreProviders = [{ provide: PRODUCT_REVIEW_STORE_CONFIG, useClass: ReviewsStoreConfig }];

export function provideProductReviewStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState('rating', productReviewReducers, PRODUCT_REVIEW_STORE_CONFIG),
    provideEffects(productReviewsEffects),
    ...productReviewStoreProviders,
  ]);
}

export class ProductReviewStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<ProductReviewState>)[]) {
    return StoreModule.forFeature('rating', pick(productReviewReducers, reducers), PRODUCT_REVIEW_STORE_CONFIG);
  }
}
