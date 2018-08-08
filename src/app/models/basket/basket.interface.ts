import { Address } from '../address/address.model';
import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { BasketTotalData } from '../basket-total/basket-total.interface';
import { Price } from '../price/price.model';
import { ShippingBucket } from '../shipping-bucket/shipping-bucket.model';

export interface BasketData {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  shippingBuckets: ShippingBucket[];
  totals: BasketTotalData;
  valueRebates?: BasketRebate[];
  itemSurchargeTotalsByType: {
    amount: Price;
    description: string;
    displayName: string;
    name: string;
    type: string;
  }[];
}
