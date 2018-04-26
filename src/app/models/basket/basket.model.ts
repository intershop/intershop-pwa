import { Address } from '../address/address.model';
import { BasketItem } from '../basket-item/basket-item.model';
import { Price } from '../price/price.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

export interface Basket {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  InvoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  lineItems?: BasketItem[];
  totals: {
    itemTotal: Price;
    itemRebatesTotal?: Price;
    shippingTotal?: Price;
    itemShippingRebatesTotal?: Price;
    basketValueRebatesTotal?: Price;
    basketShippingRebatesTotal?: Price;
    taxTotal: Price;
    dutiesAndSurchargesTotal?: Price;
    basketTotal: Price;
  };
}

export * from './basket.helper';
