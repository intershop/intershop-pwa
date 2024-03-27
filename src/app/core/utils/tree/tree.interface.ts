export interface DynamicFlatNode {
  displayName: string;
  id: string;
  level?: number;
  expandable?: boolean;
  parentId?: string;
  childrenIds?: string[];
}
