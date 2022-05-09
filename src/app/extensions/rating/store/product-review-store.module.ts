import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ProductReviewState } from './product-review-store';
import { ProductReviewsEffects } from './product-reviews/product-reviews.effects';
import { productReviewsReducer } from './product-reviews/product-reviews.reducer';

const productReviewReducers: ActionReducerMap<ProductReviewState> = { productReviews: productReviewsReducer };

const productReviewsEffects = [ProductReviewsEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(productReviewsEffects), StoreModule.forFeature('rating', productReviewReducers)],
})
export class ProductReviewStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ProductReviewState>)[]) {
    return StoreModule.forFeature('rating', pick(productReviewReducers, reducers));
  }
}
