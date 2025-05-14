import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface SparqueImage {
  id: string;
  isPrimaryImage?: boolean;
  attributes?: Attribute[];
}
