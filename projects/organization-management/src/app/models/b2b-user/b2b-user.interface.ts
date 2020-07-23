import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface B2bUserData {
  name: string;
  login: string;
  attributes: Attribute[];
}
