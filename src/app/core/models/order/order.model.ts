import { Basket, BasketView } from '../basket/basket.model';

export interface AbstractOrder {
  documentNo: string;
  creationDate: Date;
  statusCode: string;
  status: string;
}

export interface Order extends Basket, AbstractOrder {}

export interface OrderView extends BasketView, AbstractOrder {}
