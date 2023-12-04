export interface Group {
  id: string;
  name: string;
  description?: string;
  organization?: string;
  parentId?: string;
  childrenIds?: string[];
}
