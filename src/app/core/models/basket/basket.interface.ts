import { AddressData } from '../address/address.interface';
import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { BasketTotalData } from '../basket-total/basket-total.interface';
import { Price } from '../price/price.model';
import { ShippingBucketData } from '../shipping-bucket/shipping-bucket.interface';

export interface BasketData {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: AddressData;
  shippingBuckets: ShippingBucketData[];
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
