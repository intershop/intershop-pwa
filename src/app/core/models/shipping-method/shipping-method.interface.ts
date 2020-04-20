import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';

export interface ShippingMethodData {
  name: string;
  id: string;
  description: string;
  deliveryTimeMin?: string;
  deliveryTimeMax?: string;
  shippingCosts: PriceItemData;
}
