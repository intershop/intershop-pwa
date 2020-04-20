import { Price } from 'ish-core/models/price/price.model';

export interface QuoteRequestItem {
  id?: string;
  type: string;
  quantity: {
    type: string;
    value: number;
    unit?: string;
  };
  originQuantity: {
    type: string;
    value: number;
    unit?: string;
  };
  singleBasePrice: Price;
  originSingleBasePrice: Price;
  totals: {
    total: Price;
    originTotal: Price;
  };
  productSKU: string;
}
