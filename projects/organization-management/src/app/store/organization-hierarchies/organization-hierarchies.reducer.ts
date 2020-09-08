import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { NodeHelper } from '../../models/node/node.helper';
import { NodeTree } from '../../models/node/node.model';

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
  groups: NodeTree;
}

export const initialState: OrganizationHierarchiesState = {
  loading: false,
  error: undefined,
  groups: NodeHelper.empty(),
};

export const organizationHierarchiesReducer = createReducer(
  initialState,
  setLoadingOn(loadGroups, createGroup),
  setErrorOn(loadGroupsFail, createGroupFail),
  on(loadGroupsSuccess, (state: OrganizationHierarchiesState, action) => ({
    ...state,
    groups: action.payload.nodeTree,
    error: undefined,
    loading: false,
  })),
  on(createGroupSuccess, (state: OrganizationHierarchiesState, action) => {
    const node = action.payload.nodeTree;
    return {
      groups: NodeHelper.merge(state.groups, {
        edges: { ...node.edges },
        nodes: { ...node.nodes },
        rootIds: [],
      }),
      loading: false,
      error: undefined,
    };
  })
);
