import { Price } from 'ish-core/models/price/price.model';

export interface ProductNotificationData {
  sku: string;
  notificationMailAddress: string;
  price?: Price;
}
