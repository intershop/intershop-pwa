import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Price } from 'ish-core/models/price/price.model';

export interface Warranty {
  id: string;
  name: string;
  price: Price;
  shortDescription?: string;
  longDescription?: string;
  attributes?: Attribute[];
}
