import { Price } from 'ish-core/models/price/price.model';

export interface PriceItem {
  gross: Price;
  net: Price;
  tax?: Price;
}
