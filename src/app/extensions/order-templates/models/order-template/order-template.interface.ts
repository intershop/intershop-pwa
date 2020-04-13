import { Attribute } from 'ish-core/models/attribute/attribute.model';

import { OrderTemplateHeader } from './order-template.model';

export interface OrderTemplateData extends OrderTemplateHeader {
  items?: { attributes: Attribute[] }[];
  itemsCount?: number;
  name?: string;
  uri?: string;
  creationDate?: Date;
}
