import { Price } from '../price/price.model';

export interface QuoteRequestItemData {
  type: string;
  quantity: {
    type: string;
    value: number;
    unit?: string;
  };
  singlePrice: Price;
  totalPrice: Price;
  productSKU: string;
}
