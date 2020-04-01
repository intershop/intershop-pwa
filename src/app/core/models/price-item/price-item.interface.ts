import { PriceData } from 'ish-core/models/price/price.interface';

export interface PriceItemData {
  gross: PriceData;
  net: PriceData;
  tax?: PriceData;
}
