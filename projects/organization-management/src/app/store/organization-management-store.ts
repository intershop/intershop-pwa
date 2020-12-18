import { createFeatureSelector } from '@ngrx/store';

import { BudgetState } from './budget/budget.reducer';
import { UsersState } from './users/users.reducer';

export interface OrganizationManagementState {
  users: UsersState;
  budget: BudgetState;
}

export const getOrganizationManagementState = createFeatureSelector<OrganizationManagementState>(
  'organizationManagement'
);
