export interface ContentPageTreeLink {
  type: string;
  title: string;
  itemId: string;
}

export interface ContentPageTreeData {
  type: string;
  parent?: ContentPageTreeLink;
  path?: ContentPageTreeLink[];
  page: ContentPageTreeLink;
  elements?: ContentPageTreeData[] | ContentPageTreeLink[];
}
