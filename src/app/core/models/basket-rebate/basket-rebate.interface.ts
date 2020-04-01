import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';

export interface BasketRebateData {
  id: string;
  promotionType: string;
  amount: PriceItemData;
  description?: string;
  code?: string;
  promotion?: string;
}
