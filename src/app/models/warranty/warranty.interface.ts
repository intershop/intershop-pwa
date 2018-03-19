import { Attribute } from '../attribute/attribute.model';

export interface WarrantyData {
  type: string;
  description: string;
  title: string;
  uri: string;
  attributes: Attribute[];
}
