export interface OrganizationGroup {
  id: string;
  parentId?: string;
  description?: string;
  organization?: string;
  name: string;
  childrenIds?: string[];
}
