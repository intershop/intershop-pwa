import { createFeatureSelector } from '@ngrx/store';

import { ProductReviewsState } from './product-reviews/product-reviews.reducer';

export interface ProductReviewState {
  productReviews: ProductReviewsState;
}

export const getProductReviewState = createFeatureSelector<ProductReviewState>('rating');
