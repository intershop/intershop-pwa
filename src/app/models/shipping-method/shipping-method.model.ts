export interface ShippingMethod {
  name: string;
  type: string;
  id: string;
  description: string;
  shippingTimeMin: number;
  shippingTimeMax: number;
}
