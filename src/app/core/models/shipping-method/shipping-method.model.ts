import { PriceItem } from 'ish-core/models/price-item/price-item.model';

export interface ShippingMethod {
  name: string;
  id: string;
  description: string;
  shippingTimeMin?: number;
  shippingTimeMax?: number;
  shippingCosts?: PriceItem;
}
