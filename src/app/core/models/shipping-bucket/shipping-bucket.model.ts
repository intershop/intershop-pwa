import { Address } from '../address/address.model';
import { LineItem } from '../line-item/line-item.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

export interface ShippingBucket {
  lineItems: LineItem[];
  name: string;
  shipToAddress: Address;
  shippingMethod: ShippingMethod;
}
