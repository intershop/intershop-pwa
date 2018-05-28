import { Address } from '../address/address.model';
import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { Price } from '../price/price.model';
import { ShippingBucket } from '../shipping-bucket/shipping-bucket.model';

export interface BasketData {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  shippingBuckets: ShippingBucket[];
  totals: {
    basketShippingRebatesTotal?: Price;
    basketTotal: Price;
    basketValueRebatesTotal?: Price;
    dutiesAndSurchargesTotal?: Price;
    itemRebatesTotal?: Price;
    itemShippingRebatesTotal?: Price;
    itemTotal: Price;
    paymentCostsTotal?: Price;
    shippingTotal?: Price;
    taxTotal: Price;
  };
  valueRebates?: BasketRebate[];
  itemSurchargeTotalsByType: [
    {
      amount: Price;
      description: string;
      displayName: string;
      name: string;
      type: string;
    }
  ];
}
