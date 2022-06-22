import { Price } from 'ish-core/models/price/price.model';

export interface Warranty {
  id: string;
  name: string;
  price: Price;
  shortDescription?: string;
  longDescription?: string;
  years?: string;
  timePeriod?: string;
  type?: string;
  code?: string;
}
