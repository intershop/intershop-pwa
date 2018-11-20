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
  originQuantity: {
    type: string;
    value: number;
    unit?: string;
  };
  originSinglePrice: Price;
  originTotalPrice: Price;
  productSKU: string;
}
