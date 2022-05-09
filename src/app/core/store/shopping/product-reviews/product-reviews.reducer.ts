import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ProductReviews as ProductReviewsModel } from 'ish-core/models/product-reviews/product-reviews.model';

import { loadProductReviewsSuccess } from './product-reviews.actions';

export const productReviewsAdapter = createEntityAdapter<ProductReviewsModel>({
  selectId: review => review.sku,
});

export type ProductReviewsState = EntityState<ProductReviewsModel>;

const initialState: ProductReviewsState = productReviewsAdapter.getInitialState({});

export const productReviewsReducer = createReducer(
  initialState,
  on(loadProductReviewsSuccess, (state, action) => productReviewsAdapter.upsertOne(action.payload.reviews, state))
);
