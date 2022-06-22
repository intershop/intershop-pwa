import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PriceData } from 'ish-core/models/price/price.interface';

export interface WarrantyData {
  sku: string;
  name: string;
  price: PriceData;
  shortDescription: string;
  longDescription: string;
  attributes: Attribute[];
}
