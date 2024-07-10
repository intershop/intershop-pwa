import { DynamicFlatNode } from 'ish-core/utils/tree/tree.interface';

export interface OrganizationHierarchiesGroup extends DynamicFlatNode {
  description?: string;
  organization?: string;
}
