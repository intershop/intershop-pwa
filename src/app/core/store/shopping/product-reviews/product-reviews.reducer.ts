import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ProductReviews as ProductReviewsModel } from 'ish-core/models/product-reviews/product-reviews.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { loadProductReviews, loadProductReviewsFail, loadProductReviewsSuccess } from './product-reviews.actions';

export const productReviewsAdapter = createEntityAdapter<ProductReviewsModel>({
  selectId: review => review.sku,
});

export interface ProductReviewsState extends EntityState<ProductReviewsModel> {
  loading: boolean;
  error: HttpError;
}

const initialState: ProductReviewsState = productReviewsAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const productReviewsReducer = createReducer(
  initialState,
  setLoadingOn(loadProductReviews),
  on(loadProductReviewsSuccess, (state, action) =>
    productReviewsAdapter.upsertOne(action.payload.reviews, { ...state, loading: false, error: undefined })
  ),
  unsetLoadingAndErrorOn(loadProductReviewsSuccess, loadProductReviewsFail),
  setErrorOn(loadProductReviewsFail)
);
