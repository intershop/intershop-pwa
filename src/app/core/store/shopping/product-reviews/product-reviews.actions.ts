import { createAction } from '@ngrx/store';

import { ProductReviews } from 'ish-core/models/product-reviews/product-reviews.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const loadProductReviews = createAction('[Product Review] Load Product Reviews', payload<{ sku: string }>());

export const loadProductReviewsSuccess = createAction(
  '[Products API] Load Product Reviews Success',
  payload<{ reviews: ProductReviews }>()
);
