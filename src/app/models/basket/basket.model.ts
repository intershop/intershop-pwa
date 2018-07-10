import { Address } from '../address/address.model';
import { BasketItem, BasketItemView } from '../basket-item/basket-item.model';
import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { PaymentMethod } from '../payment-method/payment-method.model';
import { Price } from '../price/price.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

interface AbstractBasket<T> {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  paymentMethod?: PaymentMethod;
  lineItems?: T[];
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

export interface Basket extends AbstractBasket<BasketItem> {}

export interface BasketView extends AbstractBasket<BasketItemView> {}

export * from './basket.helper';
