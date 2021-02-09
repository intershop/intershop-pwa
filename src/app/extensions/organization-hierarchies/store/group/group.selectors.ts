import { createSelector } from '@ngrx/store';

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

export const getSelectedGroupPath = createSelector(
  selectEntities,
  getSelectedGroupId,
  (entities, id): OrganizationGroup[] => {
    let current = id && entities[id];
    const ret = new Array<OrganizationGroup>();
    while (typeof current !== 'undefined') {
      ret.push(current);
      current = current.parentid ? entities[current.parentid] : undefined;
    }
    return ret;
  }
);
