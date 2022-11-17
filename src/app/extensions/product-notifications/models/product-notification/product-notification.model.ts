import { Price } from 'ish-core/models/price/price.model';

export type ProductNotificationType = 'stock' | 'price';
export interface ProductNotification {
  id: string;
  type: ProductNotificationType;
  sku: string;
  notificationMailAddress: string;
  price?: Price;
}
