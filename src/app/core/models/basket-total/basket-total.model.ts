import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

export interface BasketTotal {
  itemTotal: PriceItem;
  undiscountedItemTotal?: PriceItem;
  shippingTotal?: PriceItem;
  undiscountedShippingTotal?: PriceItem;
  paymentCostsTotal?: PriceItem;
  dutiesAndSurchargesTotal?: PriceItem;
  taxTotal?: Price;
  total: PriceItem;

  itemRebatesTotal?: PriceItem;
  valueRebatesTotal?: PriceItem;
  valueRebates?: BasketRebate[];

  itemShippingRebatesTotal?: PriceItem;
  shippingRebatesTotal?: PriceItem;
  shippingRebates?: BasketRebate[];

  itemSurchargeTotalsByType?: {
    amount: PriceItem;
    description: string;
    displayName: string;
  }[];

  bucketSurchargeTotalsByType?: {
    amount: PriceItem;
    description: string;
    displayName: string;
  }[];
  isEstimated: boolean;
}
