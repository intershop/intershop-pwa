import { Injectable } from '@angular/core';

import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { BasketRebate } from './basket-rebate.model';

@Injectable({ providedIn: 'root' })
export class BasketRebateMapper {
  constructor(private priceMapper: PriceMapper) {}

  fromData(data: BasketRebateData): BasketRebate {
    if (data) {
      return {
        id: data.id,
        amount: this.priceMapper.fromPriceItem(data.amount),
        description: data.description,
        rebateType: data.promotionType,
        code: data.code,
        promotionId: data.promotion,
      };
    }
  }
}
