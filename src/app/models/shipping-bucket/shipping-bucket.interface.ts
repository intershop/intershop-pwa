import { Address } from '../address/address.model';
import { BasketItemData } from '../basket-item/basket-item.interface';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

export interface ShippingBucketData {
  lineItems: BasketItemData[];
  name: string;
  shipToAddress: Address;
  shippingMethod: ShippingMethod;
}
