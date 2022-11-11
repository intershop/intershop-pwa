import { Injectable } from '@angular/core';

import { ProductNotificationData } from './product-notification.interface';
import { ProductNotification } from './product-notification.model';

@Injectable({ providedIn: 'root' })
export class ProductNotificationMapper {
  static fromData(productNotificationData: ProductNotificationData): ProductNotification {
    if (productNotificationData) {
      if (productNotificationData.price) {
        return {
          id: productNotificationData.sku.concat('_price'),
          type: 'price',
          sku: productNotificationData.sku,
          notificationMailAddress: productNotificationData.notificationMailAddress,
          price: productNotificationData.price,
        };
      } else {
        return {
          id: productNotificationData.sku.concat('_stock'),
          type: 'stock',
          sku: productNotificationData.sku,
          notificationMailAddress: productNotificationData.notificationMailAddress,
          price: productNotificationData.price,
        };
      }
    } else {
      throw new Error(`productNotificationData is required`);
    }
  }
}
