import { Link } from '../link/link.model';
import { Price } from '../price/price.model';
import { QuoteRequestItemData } from '../quote-request-item/quote-request-item.interface';
import { QuoteRequestItem, QuoteRequestItemView } from '../quote-request-item/quote-request-item.model';

export type QuoteRequestStateType = 'New' | 'Submitted';

interface AbstractQuoteRequest<T> {
  type: 'QuoteRequest';
  displayName: string;
  id: string;
  number: string;
  creationDate: number;
  total: Price;
  items: (Link | T)[];
  state: QuoteRequestStateType;
  modified?: number;
  description?: string;

  editable?: boolean;
  submitted?: boolean;
}

export interface QuoteRequest extends AbstractQuoteRequest<QuoteRequestItem | QuoteRequestItemData> {}

export interface QuoteRequestView extends AbstractQuoteRequest<QuoteRequestItemView> {}
