import { Price } from 'ish-core/models/price/price.model';

import { PriceItem } from './price-item.model';

export class PriceItemHelper {
  static selectType(priceItem: PriceItem, type: 'gross' | 'net'): Price {
    if (priceItem && type) {
      return {
        type: 'Money',
        currency: priceItem.currency,
        value: priceItem[type],
      };
    }
  }
}
