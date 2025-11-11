import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface NavigationCategory {
  uniqueId: string;
  name: string;
  url: string;
  hasChildren: boolean;
  children?: NavigationCategory[];
  attributes?: Attribute[];
}
