import { Price } from '../price/price.model';
import { Promotion } from '../promotion/promotion.model';

export interface BasketRebate {
  id: string;
  amount: Price;
  description?: string;
  rebateType: string;
  code?: string;
  promotion?: Promotion;
}
