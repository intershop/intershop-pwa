import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { ProductNotification } from '../../models/product-notification/product-notification.model';

import {
  createProductNotification,
  createProductNotificationFail,
  createProductNotificationSuccess,
  deleteProductNotification,
  deleteProductNotificationFail,
  deleteProductNotificationSuccess,
  loadProductNotifications,
  loadProductNotificationsFail,
  loadProductNotificationsSuccess,
} from './product-notification.actions';

export const productNotificationAdapter = createEntityAdapter<ProductNotification>();

export interface ProductNotificationState extends EntityState<ProductNotification> {
  loading: boolean;
  error: HttpError;
}

export const initialState: ProductNotificationState = productNotificationAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const productNotificationReducer = createReducer(
  initialState,
  setLoadingOn(loadProductNotifications, createProductNotification, deleteProductNotification),
  setErrorOn(loadProductNotificationsFail, createProductNotificationFail, deleteProductNotificationFail),
  unsetLoadingAndErrorOn(
    loadProductNotificationsSuccess,
    createProductNotificationSuccess,
    deleteProductNotificationSuccess
  ),
  on(loadProductNotificationsSuccess, (state, action) =>
    productNotificationAdapter.upsertMany(action.payload.productNotifications, state)
  )
  // on(createProductNotificationSuccess, (state, action) => {
  //   const productNotification: ProductNotification = {
  //     sku: action.payload.reviews.sku,
  //     notification: state.entities[action.payload.notification.sku]?.notification?.concat(
  //       action.payload.notification.notification
  //     ),
  //   };

  //   return productNotificationAdapter.upsertOne(productNotification, state);
  // }),
  // on(deleteProductNotificationSuccess, (state, action) => {
  //   const productReviews: ProductReviewsModel = {
  //     sku: action.payload.sku,
  //     reviews: state.entities[action.payload.sku]?.reviews?.filter(review => review.id !== action.payload.review.id),
  //   };
  //   return productReviewsAdapter.upsertOne(productReviews, state);
  // })
);
