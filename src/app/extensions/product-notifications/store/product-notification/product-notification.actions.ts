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
