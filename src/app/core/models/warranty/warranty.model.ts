import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface Warranty {
  type: string;
  description: string;
  title: string;
  uri: string;
  attributes: Attribute[];
}
