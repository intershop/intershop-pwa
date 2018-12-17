import { AddressData } from '../address/address.interface';
import { BasketItemData } from '../basket-item/basket-item.interface';
import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { BasketTotalData } from '../basket-total/basket-total.interface';
import { PriceItem } from '../price-item/price-item.interface';
import { ShippingMethodData } from '../shipping-method/shipping-method.interface';

export interface BasketBaseData {
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
  lineItems?: string[];
  totals: BasketTotalData;
  totalProductQuantity?: number;
  surcharges?: {
    itemSurcharges?: {
      amount: PriceItem;
      description: string;
      name: string;
    }[];
  };
}

export interface BasketData {
  data: BasketBaseData;
  included?: {
    invoiceToAddress?: { [urn: string]: AddressData };
    lineItems?: { [id: string]: BasketItemData };
    discounts?: { [id: string]: BasketRebateData };
    commonShipToAddress?: { [urn: string]: AddressData };
    commonShippingMethod?: { [id: string]: ShippingMethodData };
  };
}
