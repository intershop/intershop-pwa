import { Basket, BasketView } from '../basket/basket.model';

export interface AbstractOrder {
  documentNo: string;
  creationDate: Date;
  status: string;
}

export interface Order extends Basket, AbstractOrder {}

export interface OrderView extends BasketView, AbstractOrder {}
