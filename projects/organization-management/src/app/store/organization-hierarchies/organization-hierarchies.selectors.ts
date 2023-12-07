import { createSelector } from '@ngrx/store';

import { getOrganizationManagementState } from '../organization-management-store';

import { groupAdapter } from './organization-hierarchies.reducer';

const getOrganizationHierarchiesState = createSelector(
  getOrganizationManagementState,
  state => state.organizationHierarchies
);

const { selectEntities, selectAll } = groupAdapter.getSelectors(getOrganizationHierarchiesState);

export const getSelectedGroupId = createSelector(getOrganizationHierarchiesState, state => state.selected);

export const getSelectedGroup = createSelector(
  selectEntities,
  getSelectedGroupId,
  (entities, id) => id && entities[id]
);

export const getGroups = selectAll;

export const getGroup = (groupId: string) =>
  createSelector(selectAll, entities => entities.find(e => e.id === groupId));

export const getGroupsByID = (groupIds: string[]) =>
  createSelector(selectAll, entities => entities.filter(e => groupIds.includes(e.id)));

export const getChilds = (groupId: string) =>
  createSelector(selectAll, entities => entities.find(e => e.id === groupId).childrenIds);

export const getParent = (groupId: string) =>
  createSelector(selectAll, entities => entities.find(e => e.id === groupId).parentId);

export const getOrganizationGroupsLoading = createSelector(getOrganizationHierarchiesState, state => state.loading);

export const getOrganizationGroupsError = createSelector(getOrganizationHierarchiesState, state => state.error);
