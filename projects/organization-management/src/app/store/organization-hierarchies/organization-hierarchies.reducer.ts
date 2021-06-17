import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { GroupHelper } from '../../models/group/group.helper';
import { GroupTree } from '../../models/group/group.model';

import {
  createGroup,
  createGroupFail,
  createGroupSuccess,
  loadGroups,
  loadGroupsFail,
  loadGroupsSuccess,
} from './organization-hierarchies.actions';

export interface OrganizationHierarchiesState {
  loading: boolean;
  error: HttpError;
  groups: GroupTree;
}

const initialState: OrganizationHierarchiesState = {
  loading: false,
  error: undefined,
  groups: GroupHelper.empty(),
};

export const organizationHierarchiesReducer = createReducer(
  initialState,
  setLoadingOn(loadGroups, createGroup),
  setErrorOn(loadGroupsFail, createGroupFail),
  unsetLoadingAndErrorOn(loadGroupsSuccess, createGroupSuccess),
  on(loadGroupsSuccess, (state: OrganizationHierarchiesState, action) => ({
    ...state,
    groups: action.payload.groupTree,
    error: undefined,
    loading: false,
  })),
  on(createGroupSuccess, (state: OrganizationHierarchiesState, action) => {
    const group = action.payload.groupTree;
    return {
      groups: GroupHelper.merge(state.groups, {
        edges: { ...group.edges },
        groups: { ...group.groups },
        rootIds: [],
      }),
      loading: false,
      error: undefined,
    };
  })
);
