import { PriceData } from './price.interface';
import { Price } from './price.model';

export class PriceMapper {
  static fromData(data: PriceData): Price {
    if (data && data.currency && data.currency !== 'N/A') {
      return {
        type: 'Money',
        currency: data.currency,
        value: data.value,
      };
    }
    return;
  }
}
