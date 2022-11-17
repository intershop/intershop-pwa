import { Injectable } from '@angular/core';

import { ProductNotificationData } from './product-notification.interface';
import { ProductNotification, ProductNotificationType } from './product-notification.model';

@Injectable({ providedIn: 'root' })
export class ProductNotificationMapper {
  static fromData(
    productNotificationData: ProductNotificationData,
    notificationType: ProductNotificationType
  ): ProductNotification {
    if (productNotificationData) {
      return {
        id: productNotificationData.sku.concat('_').concat(notificationType),
        type: notificationType,
        sku: productNotificationData.sku,
        notificationMailAddress: productNotificationData.notificationMailAddress,
        price: productNotificationData.price,
      };
    } else {
      throw new Error(`productNotificationData is required`);
    }
  }
}
