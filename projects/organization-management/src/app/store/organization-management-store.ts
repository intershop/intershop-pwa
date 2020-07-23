import { createFeatureSelector } from '@ngrx/store';

import { UsersState } from './users/users.reducer';

export interface OrganizationManagementState {
  users: UsersState;
}

export const getOrganizationManagementState = createFeatureSelector<OrganizationManagementState>(
  'organizationManagement'
);
