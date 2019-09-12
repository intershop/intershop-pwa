import { PriceItem } from 'ish-core/models/price-item/price-item.interface';

import { Price } from './price.model';

/**
 * Maps a price item to a gross or net price.
 * @param priceItem A price Item.
 * @param priceType The price type (gross/net), default: gross
 * @returns         The price.
 */
export class PriceMapper {
  static defaultPriceType = 'gross';
  static fromPriceItem(dataItem: PriceItem, priceType: string = PriceMapper.defaultPriceType): Price {
    if (dataItem && dataItem[priceType]) {
      return {
        type: 'Money',
        value: dataItem[priceType].value,
        currency: dataItem[priceType].currency,
      };
    }
  }
}
