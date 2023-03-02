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
  updateProductNotification,
  updateProductNotificationFail,
  updateProductNotificationSuccess,
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
  setLoadingOn(
    loadProductNotifications,
    createProductNotification,
    updateProductNotification,
    deleteProductNotification
  ),
  setErrorOn(
    loadProductNotificationsFail,
    createProductNotificationFail,
    updateProductNotificationFail,
    deleteProductNotificationFail
  ),
  unsetLoadingAndErrorOn(
    loadProductNotificationsSuccess,
    createProductNotificationSuccess,
    updateProductNotificationSuccess,
    deleteProductNotificationSuccess
  ),
  on(loadProductNotificationsSuccess, (state, action) =>
    /**
     * Product notifications can be deleted on server side when the notification requirements
     * are met and the notification email was sent. Therefore, all product notifications
     * have to be removed from the state which are not returned from the service before they
     * are loaded, displayed or used.
     */
    productNotificationAdapter.upsertMany(action.payload.productNotifications, {
      ...productNotificationAdapter.removeMany(entity => entity.type === action.payload.type, state),
    })
  ),
  on(createProductNotificationSuccess, (state, action) =>
    productNotificationAdapter.addOne(action.payload.productNotification, state)
  ),
  on(updateProductNotificationSuccess, (state, action) =>
    productNotificationAdapter.upsertOne(action.payload.productNotification, state)
  ),
  on(deleteProductNotificationSuccess, (state, action) => {
    const id = action.payload.productNotificationId;

    return {
      ...productNotificationAdapter.removeOne(id, state),
    };
  })
);
