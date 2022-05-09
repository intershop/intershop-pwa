import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { ProductReviews } from '../../models/product-reviews/product-reviews.model';

export const loadProductReviews = createAction('[Product Review] Load Product Reviews', payload<{ sku: string }>());

export const loadProductReviewsSuccess = createAction(
  '[Products API] Load Product Reviews Success',
  payload<{ reviews: ProductReviews }>()
);

export const loadProductReviewsFail = createAction('[Products API] Load Product Reviews Fail', httpError());
