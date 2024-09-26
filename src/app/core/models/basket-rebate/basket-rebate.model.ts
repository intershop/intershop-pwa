import { PriceItem } from 'ish-core/models/price-item/price-item.model';

export interface BasketRebate {
  id: string;
  amount: PriceItem;
  code?: string;
  promotionId?: string;
}
