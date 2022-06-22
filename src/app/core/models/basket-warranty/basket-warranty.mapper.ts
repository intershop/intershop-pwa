import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';

import { BasketWarrantyData } from './basket-warranty.interface';
import { BasketWarranty } from './basket-warranty.model';

export class BasketWarrantyMapper {
  static fromData(data: BasketWarrantyData): BasketWarranty {
    if (data) {
      return {
        sku: data.product,
        price: PriceItemMapper.fromPriceItem(data.price),
      };
    }
  }
}
