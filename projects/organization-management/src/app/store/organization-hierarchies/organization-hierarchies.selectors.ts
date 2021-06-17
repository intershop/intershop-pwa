import { createSelector } from '@ngrx/store';

import { getOrganizationManagementState } from '../organization-management-store';

const getOrganizationHierarchiesState = createSelector(
  getOrganizationManagementState,
  state => state.organizationHierarchies
);

export const getOrganizationGroups = createSelector(getOrganizationHierarchiesState, state => state.groups);

export const getOrganizationGroupsLoading = createSelector(getOrganizationHierarchiesState, state => state.loading);

export const getOrganizationGroupsError = createSelector(getOrganizationHierarchiesState, state => state.error);
