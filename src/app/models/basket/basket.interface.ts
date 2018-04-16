import { Address } from '../address/address.model';
import { Price } from '../price/price.model';
import { ShippingBucket } from '../shipping-bucket/shipping-bucket.model';

export interface BasketData {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  InvoiceToAddress?: Address;
  shippingBuckets: ShippingBucket[];
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
