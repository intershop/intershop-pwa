import { createFeatureSelector } from '@ngrx/store';

import { ProductNotificationState } from './product-notification/product-notification.reducer';

export interface ProductNotificationsState {
  productNotifications: ProductNotificationState;
}

export const getProductNotificationsState = createFeatureSelector<ProductNotificationsState>('productNotifications');
