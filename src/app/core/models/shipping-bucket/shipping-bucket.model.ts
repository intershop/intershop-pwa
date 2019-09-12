import { Address } from 'ish-core/models/address/address.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

export interface ShippingBucket {
  lineItems: LineItem[];
  name: string;
  shipToAddress: Address;
  shippingMethod: ShippingMethod;
}
