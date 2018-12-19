import { AddressData } from '../address/address.interface';

import { OrderItemData } from '../order-item/order-item.interface';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

/* shipping bucket data model is currently only used for orders */
export interface ShippingBucketData {
  lineItems: OrderItemData[];
  name: string;
  shipToAddress: AddressData;
  shippingMethod: ShippingMethod;
}
