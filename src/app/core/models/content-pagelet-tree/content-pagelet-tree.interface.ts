import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface ContentPageletTreeLink {
  type: string;
  uri: string;
  title: string;
  itemId: string;

  name?: string;
  relation?: string;
  attributes?: Attribute[];
  description?: string;
  attribute?: Attribute;
}

export interface ContentPageletTreeData {
  name: string;
  type: string;
  attributes?: Attribute[];
  parent?: ContentPageletTreeLink;
  path?: ContentPageletTreeLink[];
  page: ContentPageletTreeLink;
  link: ContentPageletTreeLink;
  elements?: ContentPageletTreeData[] | ContentPageletTreeLink[];
}
