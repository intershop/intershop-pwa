import { BasketItem, BasketItemView } from '../basket-item/basket-item.model';
import { AbstractBasket } from '../basket/basket.model';

export interface AbstractOrder {
  documentNo: string;
  creationDate: Date;
  status: string;
}

export interface Order extends AbstractBasket<BasketItem>, AbstractOrder {}

export interface OrderView extends AbstractBasket<BasketItemView>, AbstractOrder {}
