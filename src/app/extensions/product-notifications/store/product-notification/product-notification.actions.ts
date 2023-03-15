import { createActionGroup } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';

export const productNotificationsActions = createActionGroup({
  source: 'Product Notifications',
  events: {
    'Load Product Notifications': payload<{ type: ProductNotificationType }>(),
    'Create Product Notification': payload<{ productNotification: ProductNotification }>(),
    'Update Product Notification': payload<{ sku: string; productNotification: ProductNotification }>(),
    'Delete Product Notification': payload<{
      sku: string;
      productNotificationType: ProductNotificationType;
      productNotificationId: string;
    }>(),
  },
});

export const productNotificationsApiActions = createActionGroup({
  source: 'Product Notification API',
  events: {
    'Load Product Notifications Success': payload<{
      productNotifications: ProductNotification[];
      type: ProductNotificationType;
    }>(),
    'Load Product Notifications Fail': httpError<{}>(),
    'Create Product Notification Success': payload<{ productNotification: ProductNotification }>(),
    'Create Product Notification Fail': httpError<{}>(),
    'Update Product Notification Success': payload<{ productNotification: ProductNotification }>(),
    'Update Product Notification Fail': httpError<{}>(),
    'Delete Product Notification Success': payload<{ productNotificationId: string }>(),
    'Delete Product Notification Fail': httpError<{}>(),
  },
});
