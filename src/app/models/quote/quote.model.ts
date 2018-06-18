import { Link } from '../link/link.model';
import { Price } from '../price/price.model';
import { QuoteRequestItem, QuoteRequestItemView } from '../quote-request-item/quote-request-item.model';

export type QuoteType = 'Quote' | 'QuoteRequest';

interface AbstractQuote<T> {
  type: QuoteType;
  displayName: string;
  id: string;
  number: string;
  creationDate: number;
  total: Price;
  items: (Link | T)[];
  state?: number;
  modified?: number;

  // Quote only
  description?: string;
  validFromDate?: number;
  validToDate?: number;
  sellerComment?: string;
  originTotal?: Price;
  rejected?: boolean;

  // QuoteRequest only
  editable?: boolean;
  submitted?: boolean;
}

export interface Quote extends AbstractQuote<QuoteRequestItem> {}

export interface QuoteView extends AbstractQuote<QuoteRequestItemView> {}
