import { Link } from '../link/link.model';
import { Price } from '../price/price.model';
import { QuoteRequestItem, QuoteRequestItemView } from '../quote-request-item/quote-request-item.model';

interface AbstractQuoteRequest<T> {
  type: 'QuoteRequest';
  displayName: string;
  id: string;
  number: string;
  creationDate: number;
  total: Price;
  items: (Link | T)[];
  state?: number;
  modified?: number;

  editable?: boolean;
  submitted?: boolean;
}

export interface QuoteRequest extends AbstractQuoteRequest<QuoteRequestItem> {}

export interface QuoteRequestView extends AbstractQuoteRequest<QuoteRequestItemView> {}
