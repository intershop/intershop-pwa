import { Price } from '../price/price.model';
import { Product } from '../product/product.model';

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

export interface QuoteRequestItemView extends QuoteRequestItem {
  product: Product;
}
