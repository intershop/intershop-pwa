import { Address } from '../address/address.model';
import { Price } from '../price/price.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

export interface Basket {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  InvoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  // tslint:disable-next-line: no-any
  lineItems?: any[]; // TODO: add propper interface
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
