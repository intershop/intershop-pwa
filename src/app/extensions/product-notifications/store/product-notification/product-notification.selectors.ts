import { createSelector } from '@ngrx/store';

import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';
import { getProductNotificationsState } from '../product-notifications-store';

import { initialState, productNotificationAdapter } from './product-notification.reducer';

const getProductNotificationState = createSelector(getProductNotificationsState, state =>
  state ? state.productNotifications : initialState
);

export const getProductNotificationsLoading = createSelector(getProductNotificationState, state => state.loading);

export const getProductNotificationsError = createSelector(getProductNotificationState, state => state.error);

export const { selectAll } = productNotificationAdapter.getSelectors(getProductNotificationState);

export const getProductNotificationsByType = (type: ProductNotificationType) =>
  createSelector(selectAll, (entities): ProductNotification[] => entities.filter(e => e.type === type));

export const getProductNotificationBySku = (sku: string, type: ProductNotificationType) =>
  createSelector(selectAll, (entities): ProductNotification[] =>
    entities.filter(e => e.sku === sku && e.type === type)
  );
