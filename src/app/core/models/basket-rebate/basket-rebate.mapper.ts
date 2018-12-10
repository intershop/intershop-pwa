import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { PriceMapper } from '../price/price.mapper';

import { BasketRebate } from './basket-rebate.model';

export class BasketRebateMapper {
  static fromData(data: BasketRebateData): BasketRebate {
    if (data) {
      return {
        amount: PriceMapper.fromPriceItem(data.amount),
        description: data.description,
        rebateType: data.promotionType,
        code: data.code,
      };
    }
  }
}
