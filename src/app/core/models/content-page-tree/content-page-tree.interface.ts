import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface ContentPageTreeLink {
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

export interface ContentPageTreeData {
  name: string;
  type: string;
  attributes?: Attribute[];
  parent?: ContentPageTreeLink;
  path?: ContentPageTreeLink[];
  page: ContentPageTreeLink;
  link: ContentPageTreeLink;
  elements?: ContentPageTreeData[] | ContentPageTreeLink[];
}
