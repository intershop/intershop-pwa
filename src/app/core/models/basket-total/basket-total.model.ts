import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { Price } from '../price/price.model';

export interface BasketTotal {
  itemTotal: Price;
  undiscountedItemTotal?: Price;
  shippingTotal?: Price;
  undiscountedShippingTotal?: Price;
  paymentCostsTotal?: Price;
  dutiesAndSurchargesTotal?: Price;
  taxTotal?: Price;
  total: Price;

  itemRebatesTotal?: Price;
  valueRebatesTotal?: Price;
  valueRebates?: BasketRebate[];

  itemShippingRebatesTotal?: Price;
  shippingRebatesTotal?: Price;
  shippingRebates?: BasketRebate[];

  itemSurchargeTotalsByType: {
    amount: Price;
    description: string;
    displayName: string;
  }[];
  isEstimated: boolean;
}
