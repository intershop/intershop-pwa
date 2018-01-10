import { AttributeData } from '../attribute/attribute.interface';

export interface WarrantyData {
  type: string;
  description: string;
  title: string;
  uri: string;
  attributes: AttributeData[];
}
