import { createSelector } from '@ngrx/store';

import { getOrganizationManagementState } from '../organization-management-store';

const getBudgetState = createSelector(getOrganizationManagementState, state => state.budget);

export const getCurrentUserBudgetLoading = createSelector(getBudgetState, state => state.loading);

export const getCurrentUserBudgetError = createSelector(getBudgetState, state => state.error);

export const getCurrentUserBudget = createSelector(getBudgetState, state => state.budget);
