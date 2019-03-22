import { BasketRebateData } from '../basket-rebate/basket-rebate.interface';
import { PriceMapper } from '../price/price.mapper';
import { Promotion } from '../promotion/promotion.model';

import { BasketRebate } from './basket-rebate.model';

export class BasketRebateMapper {
  static fromData(data: BasketRebateData, promotion: Promotion): BasketRebate {
    if (data) {
      return {
        id: data.id,
        amount: PriceMapper.fromPriceItem(data.amount),
        description: data.description,
        rebateType: data.promotionType,
        code: data.code,
        promotion,
      };
    }
  }
}
