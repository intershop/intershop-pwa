import { createSelector } from '@ngrx/store';

import { getProductReviewState } from '../product-review-store';

import { initialState, productReviewsAdapter } from './product-reviews.reducer';

const getProductReviewsState = createSelector(getProductReviewState, state => state?.productReviews || initialState);

const { selectEntities } = productReviewsAdapter.getSelectors(getProductReviewsState);

export const getProductReviewsBySku = (sku: string) =>
  createSelector(selectEntities, entities => entities[sku]?.reviews);

export const getProductReviewsError = createSelector(getProductReviewsState, state => state.error);

export const getProductReviewsLoading = createSelector(getProductReviewsState, state => state.loading);
