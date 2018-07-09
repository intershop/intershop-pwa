import { Price } from '../price/price.model';
import { QuoteRequestItemData } from '../quote-request-item/quote-request-item.interface';
import { QuoteRequestItem } from '../quote-request-item/quote-request-item.model';
import { QuoteRequestStateType } from '../quote-request/quote-request.model';

export interface QuoteData {
  type: 'Quote';
  displayName: string;
  id: string;
  number: string;
  creationDate: number;
  total: Price;
  items: (QuoteRequestItemData | QuoteRequestItem)[];
  state?: QuoteRequestStateType;
  modified?: number;
  description?: string;

  validFromDate?: number;
  validToDate?: number;
  sellerComment?: string;
  originTotal?: Price;
  rejected?: boolean;
}
