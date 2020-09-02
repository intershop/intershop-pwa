import { createFeatureSelector } from '@ngrx/store';

import { GroupState } from './group/group.reducer';

export interface OrganizationHierarchiesState {
  group: GroupState;
}

export const getOrganizationHierarchiesState = createFeatureSelector<OrganizationHierarchiesState>(
  'organizationHierarchies'
);
