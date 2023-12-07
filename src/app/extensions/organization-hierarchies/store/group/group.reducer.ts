import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import { assignGroup, loadGroupsSuccess } from './group.actions';

export const groupAdapter = createEntityAdapter<OrganizationGroup>({
  selectId: group => group.id,
  sortComparer: (groupA, groupB) =>
    !groupA.parentid ? -1 : !groupB.parentid ? 1 : groupA.name.localeCompare(groupB.name),
});

export interface GroupState extends EntityState<OrganizationGroup> {
  selected: string;
}

const initialState: GroupState = groupAdapter.getInitialState({
  selected: undefined,
});

export const groupReducer = createReducer(
  initialState,
  on(loadGroupsSuccess, (state: GroupState, action) => {
    const groups = action.payload.groups as OrganizationGroup[];
    const newState = groupAdapter.upsertMany(groups, state);
    return {
      ...newState,
      selected: action.payload.selectedGroupId
        ? action.payload.selectedGroupId
        : newState?.ids?.length
        ? (newState.ids[0] as string)
        : undefined,
    };
  }),
  on(assignGroup, (state: GroupState, action): GroupState => {
    const { id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  })
);
