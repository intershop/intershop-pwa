import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { ProductReviews as ProductReviewsModel } from '../../models/product-reviews/product-reviews.model';

import {
  createProductReview,
  createProductReviewFail,
  createProductReviewSuccess,
  deleteProductReview,
  deleteProductReviewFail,
  deleteProductReviewSuccess,
  loadProductReviews,
  loadProductReviewsFail,
  loadProductReviewsSuccess,
  resetProductReviewError,
} from './product-reviews.actions';

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
  setLoadingOn(loadProductReviews, createProductReview, deleteProductReview),
  unsetLoadingAndErrorOn(loadProductReviewsSuccess, createProductReviewSuccess, deleteProductReviewSuccess),
  setErrorOn(loadProductReviewsFail, createProductReviewFail, deleteProductReviewFail),
  on(resetProductReviewError, loadProductReviews, (state): ProductReviewsState => ({ ...state, error: undefined })),
  on(loadProductReviewsSuccess, (state, action) => productReviewsAdapter.upsertOne(action.payload.reviews, state)),
  on(createProductReviewSuccess, (state, action) => {
    const productReviews: ProductReviewsModel = {
      sku: action.payload.reviews.sku,
      reviews: state.entities[action.payload.reviews.sku]?.reviews?.concat(action.payload.reviews.reviews),
    };

    return productReviewsAdapter.upsertOne(productReviews, state);
  }),
  on(deleteProductReviewSuccess, (state, action) => {
    const productReviews: ProductReviewsModel = {
      sku: action.payload.sku,
      reviews: state.entities[action.payload.sku]?.reviews?.filter(review => review.id !== action.payload.review.id),
    };
    return productReviewsAdapter.upsertOne(productReviews, state);
  })
);
