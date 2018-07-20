import { Basket } from '../basket/basket.model';

export interface Order extends Basket {
  documentNo: string;
  creationDate: Date;
}
