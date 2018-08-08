import { Link } from '../link/link.model';
import { Price } from '../price/price.model';

export interface QuoteRequestData {
  type: 'QuoteRequest';
  displayName: string;
  id: string;
  number: string;
  creationDate: number;
  total: Price;
  items: Link[];
  modified?: number;
  description?: string;

  editable?: boolean;
  submitted?: boolean;
}
