import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface B2bUserData {
  login: string;
  attributes: Attribute[];
}
