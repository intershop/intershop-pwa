import { createSelector } from '@ngrx/store';

import { getOrganizationHierarchiesState } from '../organization-hierarchies-store';

import { groupAdapter } from './group.reducer';

const getGroupState = createSelector(getOrganizationHierarchiesState, state => state.group);

export const {
  selectAll: getGroupsOfOrganization,
  selectTotal: getGroupsOfOrganizationCount,
} = groupAdapter.getSelectors(getGroupState);
