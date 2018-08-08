import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { Price } from '../price/price.model';

export interface BasketTotal {
  shippingRebatesTotal?: Price;
  total: Price;
  valueRebatesTotal?: Price;
  dutiesAndSurchargesTotal?: Price;
  itemRebatesTotal?: Price;
  itemShippingRebatesTotal?: Price;
  itemTotal: Price;
  paymentCostsTotal?: Price;
  shippingTotal?: Price;
  taxTotal?: Price;
  valueRebates?: BasketRebate[];
  itemSurchargeTotalsByType: {
    amount: Price;
    description: string;
    displayName: string;
    name: string;
    type: string;
  }[];
  isEstimated: boolean;
}
