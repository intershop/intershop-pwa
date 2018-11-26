import { BasketTotalData } from '../basket-total/basket-total.interface';
import { PriceItem } from '../price-item/price-item.interface';

export interface BasketData {
  data: {
    id: string;
    calculationState: 'CALCULATED' | 'UNCALCULATED';
    invoiceToAddress?: string;
    commonShipToAddress?: string;
    commonShippingMethod?: string;
    discounts?: {
      dynamicMessages?: string[];
      shippingBasedDiscounts?: string[];
      valueBasedDiscounts?: string[];
    };
    buckets?: string[];
    totals: BasketTotalData;
    totalProductQuantity: number;
    surcharges?: {
      itemSurcharges?: {
        amount: PriceItem;
        description: string;
        name: string;
      }[];
    };
  };
  included?: {
    // tslint:disable:no-any
    invoiceToAddress?: any;
    lineItems?: any;
    discounts?: any;
    commonShipToAddress?: any;
    commonShippingMethod?: any;
    attributes?;
  };
}
