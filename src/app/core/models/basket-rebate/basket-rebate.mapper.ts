import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';

import { BasketRebate } from './basket-rebate.model';

export class BasketRebateMapper {
  static fromData(data: BasketRebateData): BasketRebate {
    if (data) {
      return {
        id: data.id,
        amount: PriceItemMapper.fromPriceItem(data.amount),
        description: data.description,
        rebateType: data.promotionType,
        code: data.code,
        promotionId: data.promotion,
      };
    }
  }
}
