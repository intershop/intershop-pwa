import { Address } from '../address/address.model';
import { BasketItem, BasketItemView } from '../basket-item/basket-item.model';
import { BasketTotal } from '../basket-total/basket-total.model';
import { Payment } from '../payment/payment.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

interface AbstractBasket<T> {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  payment?: Payment;
  lineItems?: T[];
  totals: BasketTotal;
}

export interface Basket extends AbstractBasket<BasketItem> {}

export interface BasketView extends AbstractBasket<BasketItemView> {
  itemsCount?: number;
}

export * from './basket.helper';
