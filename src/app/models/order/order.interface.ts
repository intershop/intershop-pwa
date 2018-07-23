import { Address } from '../address/address.model';
import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { PaymentMethod } from '../payment-method/payment-method.model';
import { Price } from '../price/price.model';
import { ShippingBucketData } from '../shipping-bucket/shipping-bucket.interface';

export interface OrderData {
  documentNo: string;
  creationDate: Date;
  status: string;
  payments: PaymentMethod[];

  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  shippingBuckets: ShippingBucketData[];
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
