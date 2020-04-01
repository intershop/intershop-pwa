import { Price } from 'ish-core/models/price/price.model';

export interface PriceItem extends Pick<Price, 'currency'> {
  type: 'PriceItem';
  gross: number;
  net: number;
}
