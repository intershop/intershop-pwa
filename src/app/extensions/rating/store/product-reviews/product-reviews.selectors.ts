import { createSelector } from '@ngrx/store';

import { getProductReviewState } from '../product-review-store';

import { productReviewsAdapter } from './product-reviews.reducer';

const getProductReviewsState = createSelector(getProductReviewState, state => state.productReviews);

const { selectEntities } = productReviewsAdapter.getSelectors(getProductReviewsState);

export const getProductReviewsBySku = (sku: string) =>
  createSelector(selectEntities, entities => entities[sku]?.reviews);

export const getProductReviewsError = createSelector(getProductReviewsState, state => state.error);

export const getProductReviewsLoading = createSelector(getProductReviewsState, state => state.loading);
