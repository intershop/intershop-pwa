import { Address } from '../address/address.model';
import { BasketItem, BasketItemView } from '../basket-item/basket-item.model';
import { BasketTotal } from '../basket-total/basket-total.model';
import { PaymentMethod } from '../payment-method/payment-method.model';
import { ShippingMethod } from '../shipping-method/shipping-method.model';

export interface AbstractBasket<T> {
  id: string;
  purchaseCurrency: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  paymentMethod?: PaymentMethod;
  lineItems?: T[];
  totals: BasketTotal;
}

export interface Basket extends AbstractBasket<BasketItem> {}

export interface BasketView extends AbstractBasket<BasketItemView> {}

export * from './basket.helper';
