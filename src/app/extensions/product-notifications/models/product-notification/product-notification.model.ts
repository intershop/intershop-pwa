import { Price } from 'ish-core/models/price/price.model';

export type ProductNotificationType = 'price' | 'stock';

export interface ProductNotification {
  id: string;
  type: ProductNotificationType;
  sku: string;
  notificationMailAddress: string;
  price?: Price;
}
