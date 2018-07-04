import { Price } from '../price/price.model';
import { QuoteRequestItemData } from '../quote-request-item/quote-request-item.interface';
import { QuoteRequestItem, QuoteRequestItemView } from '../quote-request-item/quote-request-item.model';

interface AbstractQuote<T> {
  type: 'Quote';
  displayName: string;
  id: string;
  number: string;
  creationDate: number;
  total: Price;
  items: T[];
  state?: number;
  modified?: number;
  description?: string;

  validFromDate?: number;
  validToDate?: number;
  sellerComment?: string;
  originTotal?: Price;
  rejected?: boolean;
}

export interface QuoteData extends AbstractQuote<QuoteRequestItemData> {}

export interface Quote extends AbstractQuote<QuoteRequestItem> {}

export interface QuoteView extends AbstractQuote<QuoteRequestItemView> {}
