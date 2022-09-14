import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
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

@NgModule({
  imports: [
    EffectsModule.forFeature(productReviewsEffects),
    StoreModule.forFeature('rating', productReviewReducers, PRODUCT_REVIEW_STORE_CONFIG),
  ],
  providers: [{ provide: PRODUCT_REVIEW_STORE_CONFIG, useClass: ReviewsStoreConfig }],
})
export class ProductReviewStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ProductReviewState>)[]) {
    return StoreModule.forFeature('rating', pick(productReviewReducers, reducers), PRODUCT_REVIEW_STORE_CONFIG);
  }
}
