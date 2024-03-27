import { DynamicFlatNode } from 'ish-core/utils/tree/tree.interface';

export interface OrganizationGroup extends DynamicFlatNode {
  description?: string;
  organization?: string;
}
