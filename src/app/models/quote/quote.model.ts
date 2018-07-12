import { Price } from '../price/price.model';
import { QuoteRequestItemData } from '../quote-request-item/quote-request-item.interface';
import { QuoteRequestItem, QuoteRequestItemView } from '../quote-request-item/quote-request-item.model';

export type QuoteStateType = 'Responded' | 'Rejected' | 'Converted' | 'Expired';

interface AbstractQuote<T> {
  type: 'Quote';
  displayName: string;
  id: string;
  number: string;
  creationDate: number;
  total: Price;
  items: T[];
  state: QuoteStateType;
  modified?: number;
  description?: string;

  validFromDate?: number;
  validToDate?: number;
  sellerComment?: string;
  originTotal?: Price;
  rejected?: boolean;
}

export interface Quote extends AbstractQuote<QuoteRequestItem | QuoteRequestItemData> {}

export interface QuoteView extends AbstractQuote<QuoteRequestItemView> {}
