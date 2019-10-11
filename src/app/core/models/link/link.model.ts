import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface Link {
  title: string;
  type: string;
  uri: string;
  description?: string;
  attributes?: Attribute[];
  itemId?: string;
}
