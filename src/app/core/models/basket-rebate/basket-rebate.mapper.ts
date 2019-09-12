import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { BasketRebate } from './basket-rebate.model';

export class BasketRebateMapper {
  static fromData(data: BasketRebateData): BasketRebate {
    if (data) {
      return {
        id: data.id,
        amount: PriceMapper.fromPriceItem(data.amount),
        description: data.description,
        rebateType: data.promotionType,
        code: data.code,
        promotionId: data.promotion,
      };
    }
  }
}
