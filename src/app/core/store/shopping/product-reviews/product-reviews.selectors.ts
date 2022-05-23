import { createSelector } from '@ngrx/store';

import { getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { productReviewsAdapter } from './product-reviews.reducer';

const getProductReviewsState = createSelector(getShoppingState, state => state.productReviews);

const { selectEntities } = productReviewsAdapter.getSelectors(getProductReviewsState);

export const getProductReviewsBySku = (sku: string) =>
  createSelector(selectEntities, entities => entities[sku]?.reviews);

export const getProductReviewsError = createSelector(getProductReviewsState, state => state.error);

export const getProductReviewsLoading = createSelector(getProductReviewsState, state => state.loading);
