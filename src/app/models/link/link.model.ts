import { Attribute } from '../attribute/attribute.model';

export interface Link {
  attributes: Attribute[];
  title: string;
  type: string;
  uri: string;
}
