import { createFeatureSelector } from '@ngrx/store';

import { OrganizationHierarchiesState } from './organization-hierarchies/organization-hierarchies.reducer';
import { UsersState } from './users/users.reducer';

export interface OrganizationManagementState {
  users: UsersState;
  organizationHierarchies: OrganizationHierarchiesState;
}

export const getOrganizationManagementState = createFeatureSelector<OrganizationManagementState>(
  'organizationManagement'
);
