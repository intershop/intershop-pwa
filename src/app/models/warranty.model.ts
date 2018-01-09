import { Attribute } from './attribute/attribute.model';

export class Warranty {
  type: string;
  description: string;
  title: string;
  uri: string;
  attributes: Attribute[];
}
