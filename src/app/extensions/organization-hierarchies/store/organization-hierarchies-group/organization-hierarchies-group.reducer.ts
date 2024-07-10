import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';

import {
  assignGroup,
  createGroup,
  createGroupFail,
  loadGroups,
  loadGroupsFail,
  loadGroupsSuccess,
} from './organization-hierarchies-group.actions';

export const groupAdapter = createEntityAdapter<OrganizationHierarchiesGroup>({
  selectId: group => group.id,
});

export interface OrganizationHierarchiesGroupState extends EntityState<OrganizationHierarchiesGroup> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

const initialState: OrganizationHierarchiesGroupState = groupAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const groupReducer = createReducer(
  initialState,
  setLoadingOn(loadGroups, createGroup),
  setErrorOn(loadGroupsFail, createGroupFail),
  unsetLoadingAndErrorOn(loadGroupsSuccess),
  on(loadGroupsSuccess, (state, action) => {
    const { groups } = action.payload;
    return {
      ...groupAdapter.setAll(groups, state),
    };
  }),
  on(assignGroup, (state: OrganizationHierarchiesGroupState, action): OrganizationHierarchiesGroupState => {
    const { id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  })
);
