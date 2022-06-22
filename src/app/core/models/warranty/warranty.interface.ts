import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface WarrantyData {
  sku: string;
  name: string;
  price: number;
  currencyCode: string;
  shortDescription?: string;
  longDescription?: string;
  attributes?: Attribute[];
}
