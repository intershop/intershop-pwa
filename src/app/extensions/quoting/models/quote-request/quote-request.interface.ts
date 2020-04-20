import { Link } from 'ish-core/models/link/link.model';
import { Price } from 'ish-core/models/price/price.model';

export interface QuoteRequestData {
  type: 'QuoteRequest';
  displayName: string;
  id: string;
  number: string;
  creationDate: number;
  submittedDate?: number;
  total: Price;
  items: Link[];
  modified?: number;
  description?: string;

  editable?: boolean;
  submitted?: boolean;
}
