import { createFeatureSelector } from '@ngrx/store';

import { BudgetState } from './budget/budget.reducer';
import { OrganizationHierarchiesState } from './organization-hierarchies/organization-hierarchies.reducer';
import { UsersState } from './users/users.reducer';

export interface OrganizationManagementState {
  users: UsersState;
  budget: BudgetState;
  organizationHierarchies: OrganizationHierarchiesState;
}

export const getOrganizationManagementState = createFeatureSelector<OrganizationManagementState>(
  'organizationManagement'
);
