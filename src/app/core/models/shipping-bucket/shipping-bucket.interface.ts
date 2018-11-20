import { AddressData } from '../address/address.interface';
import { BasketItemData } from '../basket-item/basket-item.interface';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

export interface ShippingBucketData {
  lineItems: BasketItemData[];
  name: string;
  shipToAddress: AddressData;
  shippingMethod: ShippingMethod;
}
