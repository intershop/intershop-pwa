import { createSelector } from '@ngrx/store';

import { getOrganizationHierarchiesState } from '../organization-hierarchies-store';

import { groupAdapter } from './group.reducer';

const getGroupState = createSelector(getOrganizationHierarchiesState, state => state.group);

export const getGroupLoading = createSelector(getGroupState, state => state.loading);

export const getGroupError = createSelector(getGroupState, state => state.error);

export const {
  selectEntities: getGroupEntities,
  selectAll: getGroups,
  selectTotal: getNumberOfGroups,
} = groupAdapter.getSelectors(getGroupState);
