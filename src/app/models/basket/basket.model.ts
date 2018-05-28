import { Address } from '../address/address.model';
import { BasketItem } from '../basket-item/basket-item.model';
import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { Price } from '../price/price.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

export interface Basket {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  lineItems?: BasketItem[];
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
    taxTotal?: Price;
  };
  valueRebates?: BasketRebate[];
  itemSurchargeTotalsByType?: [
    {
      amount: Price;
      description: string;
      displayName: string;
      name: string;
      type: string;
    }
  ];
}

export * from './basket.helper';
