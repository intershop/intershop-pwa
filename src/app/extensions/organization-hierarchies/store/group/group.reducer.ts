import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import {
  assignGroup,
  createGroup,
  createGroupFail,
  createGroupSuccess,
  loadGroups,
  loadGroupsFail,
  loadGroupsSuccess,
} from './group.actions';

export const groupAdapter = createEntityAdapter<OrganizationGroup>({
  selectId: group => group.id,
});

export interface GroupState extends EntityState<OrganizationGroup> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

const initialState: GroupState = groupAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const groupReducer = createReducer(
  initialState,
  setLoadingOn(loadGroups, createGroup),
  setErrorOn(loadGroupsFail, createGroupFail),
  unsetLoadingAndErrorOn(loadGroupsSuccess, createGroupSuccess),
  on(loadGroupsSuccess, (state, action) => {
    const { groups } = action.payload;
    return {
      ...groupAdapter.setAll(groups, state),
    };
  }),
  on(createGroupSuccess, (state, action) => {
    const { group } = action.payload;

    return {
      ...groupAdapter.upsertOne(group, state),
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
