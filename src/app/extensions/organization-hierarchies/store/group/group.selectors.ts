import { createSelector } from '@ngrx/store';

import { GroupPathEntry, OrderGroupPath } from '../../models/order-group-path/order-group-path.model';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';
import { getOrganizationHierarchiesState } from '../organization-hierarchies-store';

import { groupAdapter } from './group.reducer';

const getGroupState = createSelector(getOrganizationHierarchiesState, state => state.group);

const { selectAll, selectTotal, selectEntities } = groupAdapter.getSelectors(getGroupState);

export const getGroupsOfOrganization = selectAll;

export const getGroupsOfOrganizationCount = selectTotal;

const getSelectedGroupId = createSelector(getGroupState, state => state.selected);

export const getSelectedGroupDetails = createSelector(
  selectEntities,
  getSelectedGroupId,
  (entities, id): OrganizationGroup => id && entities[id]
);

export const getGroupDetails = (id: string) => createSelector(selectEntities, entities => id && entities[id]);

export const getCurrentGroupPath = createSelector(
  getSelectedGroupDetails,
  getGroupsOfOrganization,
  (selectedGroup, groups): OrderGroupPath => ({
    organizationId: undefined,
    groupPath: getGroupPathEntries([], selectedGroup, groups),
    groupId: selectedGroup.id,
    groupName: selectedGroup.name,
  })
);

function getGroupPathEntries(
  array: GroupPathEntry[],
  group: OrganizationGroup,
  groups: OrganizationGroup[]
): GroupPathEntry[] {
  const newArray = array?.length > 0 ? array : [];
  newArray.unshift({ groupId: group.id, groupName: group.name });
  if (group.parentid) {
    getGroupPathEntries(
      newArray,
      groups.find(element => element.id === group.parentid),
      groups
    );
  }
  return newArray;
}
