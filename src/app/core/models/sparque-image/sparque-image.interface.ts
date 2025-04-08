import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface SparqueImage {
  id: string;
  extension?: string;
  url: string;
  isPrimaryImage?: boolean;
  attributes?: Attribute[];
}
