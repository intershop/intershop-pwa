import { Address } from '../address/address.model';
import { BasketItem } from '../basket/basket-item.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

export interface ShippingBucket {
  lineItems: BasketItem[];
  name: string;
  shipToAddress: Address;
  shippingMethod: ShippingMethod;
}
