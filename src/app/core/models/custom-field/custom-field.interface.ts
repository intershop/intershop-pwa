import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface CustomFieldData extends Attribute<string> {
  type: 'String';
}
