import { createFeatureSelector } from '@ngrx/store';

import { BudgetState } from './budget/budget.reducer';
import { CostCentersState } from './cost-centers/cost-centers.reducer';
import { OrganizationHierarchiesState } from './organization-hierarchies/organization-hierarchies.reducer';
import { UsersState } from './users/users.reducer';

export interface OrganizationManagementState {
  users: UsersState;
  costCenters: CostCentersState;
  budget: BudgetState;
  organizationHierarchies: OrganizationHierarchiesState;
}

export const getOrganizationManagementState =
  createFeatureSelector<OrganizationManagementState>('organizationManagement');
