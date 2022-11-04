import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { ProductNotification } from '../../models/product-notification/product-notification.model';

import {
  loadProductNotifications,
  loadProductNotificationsFail,
  loadProductNotificationsSuccess,
} from './product-notification.actions';

export const productNotificationAdapter = createEntityAdapter<ProductNotification>({
  selectId: productNotification => productNotification.sku,
});

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
  setLoadingOn(loadProductNotifications),
  setErrorOn(loadProductNotificationsFail),
  unsetLoadingAndErrorOn(loadProductNotificationsSuccess),
  on(loadProductNotificationsSuccess, (state, action) =>
    productNotificationAdapter.upsertMany(action.payload.productNotifications, state)
  )
);
