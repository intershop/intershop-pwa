import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';

export const loadProductNotifications = createAction(
  '[ProductNotification] Load ProductNotifications',
  payload<{ type: ProductNotificationType }>()
);

export const loadProductNotificationsSuccess = createAction(
  '[ProductNotification API] Load ProductNotifications Success',
  payload<{ productNotifications: ProductNotification[] }>()
);

export const loadProductNotificationsFail = createAction(
  '[ProductNotification API] Load ProductNotifications Fail',
  httpError()
);

export const createProductNotification = createAction(
  '[Product Notification] Create Product Notification',
  payload<{ productNotification: ProductNotification }>()
);

export const createProductNotificationSuccess = createAction(
  '[Product Notification API] Create Product Notification Success',
  payload<{ productNotification: ProductNotification }>()
);

export const createProductNotificationFail = createAction(
  '[Product Notification API] Create Product Notification Fail',
  httpError()
);

export const deleteProductNotification = createAction(
  '[Product Notification] Delete Product Notification',
  payload<{ sku: string; productNotificationType: ProductNotificationType; productNotificationId: string }>()
);

export const deleteProductNotificationSuccess = createAction(
  '[Product Notification API] Delete Product Notification Success',
  payload<{ productNotificationId: string }>()
);

export const deleteProductNotificationFail = createAction(
  '[Product Notification API] Delete Product Notification Fail',
  httpError()
);
