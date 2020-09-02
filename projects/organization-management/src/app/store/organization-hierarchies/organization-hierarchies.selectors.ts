import { createSelector } from '@ngrx/store';

import { getOrganizationManagementState } from '../organization-management-store';

const getOrganizationHierarchiesState = createSelector(
  getOrganizationManagementState,
  state => state.organizationHierarchies
);

export const getOrganizationGroups = createSelector(getOrganizationHierarchiesState, state => state.groups);

export const getOrganizationHierarchiesLoading = createSelector(
  getOrganizationHierarchiesState,
  state => state.loading
);

export const getOrganizationHierarchiesError = createSelector(getOrganizationHierarchiesState, state => state.error);
