import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { ProductReview, ProductReviewCreationType } from '../../models/product-reviews/product-review.model';
import { ProductReviews } from '../../models/product-reviews/product-reviews.model';

export const loadProductReviews = createAction('[Product Review] Load Product Reviews', payload<{ sku: string }>());

export const loadProductReviewsSuccess = createAction(
  '[Product Review API] Load Product Reviews Success',
  payload<{ reviews: ProductReviews }>()
);

export const loadProductReviewsFail = createAction('[Product Review API] Load Product Reviews Fail', httpError());

export const createProductReview = createAction(
  '[Product Review] Create Product Review',
  payload<{ sku: string; review: ProductReviewCreationType }>()
);

export const createProductReviewSuccess = createAction(
  '[Product Review API] Create Product Review Success',
  payload<{ reviews: ProductReviews }>()
);

export const createProductReviewFail = createAction('[Product Review API] Create Product Review Fail', httpError());

export const deleteProductReview = createAction(
  '[Product Review] Delete Product Review',
  payload<{ sku: string; review: ProductReview }>()
);

export const deleteProductReviewSuccess = createAction(
  '[Product Review API] Delete Product Review Success',
  payload<{ sku: string; review: ProductReview }>()
);

export const deleteProductReviewFail = createAction('[Product Review API] Delete Product Review Fail', httpError());

export const resetProductReviewError = createAction('[Product Review] Reset Product Review Error');
