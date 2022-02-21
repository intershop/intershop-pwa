import { Price, ScaledPrice } from 'ish-core/models/price/price.model';

import { PriceItem, ScaledPriceItem } from './price-item.model';

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

  static selectScaledPriceType(priceItem: ScaledPriceItem, type: 'gross' | 'net'): ScaledPrice {
    if (priceItem && type) {
      return {
        type: 'Money',
        currency: priceItem.currency,
        value: priceItem[type],
        minQuantity: priceItem.minQuantity,
      };
    }
  }
}
