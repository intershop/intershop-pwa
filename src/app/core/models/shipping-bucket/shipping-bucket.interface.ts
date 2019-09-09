import { AddressData } from 'ish-core/models/address/address.interface';
import { OrderItemData } from 'ish-core/models/order-item/order-item.interface';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

/* shipping bucket data model is currently only used for orders */
export interface ShippingBucketData {
  lineItems: OrderItemData[];
  name: string;
  shipToAddress: AddressData;
  shippingMethod: ShippingMethod;
}
