import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Link } from 'ish-core/models/link/link.model';

export interface ContentPageletTreeData {
  name?: string;
  type: string;
  attributes?: Attribute[];
  parent?: Link;
  path?: Link[];
  page: Link;
  link: Link;
  elements?: ContentPageletTreeData[];
}
