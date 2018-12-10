import { Price } from '../price/price.model';

export interface ShippingMethod {
  name: string;
  id: string;
  description: string;
  shippingTimeMin?: number;
  shippingTimeMax?: number;
  shippingCosts?: Price;
}
