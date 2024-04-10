import { createSelector } from '@ngrx/store';

import { getOrganizationHierarchiesState } from '../organization-hierarchies-store';

import { groupAdapter } from './organization-hierarchies-group.reducer';

const getGroupState = createSelector(getOrganizationHierarchiesState, state => state.group);

const { selectAll, selectTotal, selectEntities } = groupAdapter.getSelectors(getGroupState);

export const getGroupsOfOrganization = selectAll;

export const getGroupsOfOrganizationCount = selectTotal;

const getSelectedGroupId = createSelector(getGroupState, state => state.selected);

export const getSelectedGroupDetails = createSelector(
  selectEntities,
  getSelectedGroupId,
  (entities, id) => id && entities[id]
);

export const getRootGroupDetails = createSelector(selectAll, entities => entities.find(e => !e.parentId));

export const getGroupDetails = (groupId: string) =>
  createSelector(selectAll, entities => entities.find(e => e.id === groupId));

export const getOrganizationGroupsLoading = createSelector(
  getOrganizationHierarchiesState,
  state => state.group.loading
);

export const getOrganizationGroupsError = createSelector(getOrganizationHierarchiesState, state => state.group.error);
