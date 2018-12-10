import { Price } from '../price/price.model';

export interface PriceItem {
  gross: Price;
  net: Price;
  tax?: Price;
}
