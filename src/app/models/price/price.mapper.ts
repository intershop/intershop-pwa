import { PriceItem } from '../price-item/price-item.interface';

import { Price } from './price.model';

export class PriceMapper {
  static priceType = 'gross';
  static fromPriceItem(dataItem: PriceItem): Price {
    if (dataItem) {
      return {
        type: 'Money',
        value: dataItem[PriceMapper.priceType].value,
        currencyMnemonic: dataItem[PriceMapper.priceType].currency,
      };
    }
  }
}
