import { Price } from 'ish-core/models/price/price.model';

export interface BasketRebate {
  id: string;
  amount: Price;
  description?: string;
  rebateType: string;
  code?: string;
  promotionId?: string;
}
