import { PriceItem } from 'ish-core/models/price-item/price-item.model';

export interface BasketRebate {
  id: string;
  amount: PriceItem;
  description?: string;
  rebateType: string;
  code?: string;
  promotionId?: string;
}
