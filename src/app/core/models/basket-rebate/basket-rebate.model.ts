import { Price } from '../price/price.model';

export interface BasketRebate {
  /* ToDo: see #IS-23184  */
  amount: Price;
  description?: string;
  rebateType: string;
  code?: string;
}
