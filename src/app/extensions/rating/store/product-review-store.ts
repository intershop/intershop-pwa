import { createSelector } from '@ngrx/store';

import { ProductReviewsState } from './product-reviews/product-reviews.reducer';

export interface ProductReviewState {
  productReviews: ProductReviewsState;
}

export const getProductReviewState = createSelector(
  (state: { rating?: ProductReviewState }) => state.rating,
  rating => rating
);
