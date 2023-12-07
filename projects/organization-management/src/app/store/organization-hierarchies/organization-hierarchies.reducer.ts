import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { Group } from '../../models/group/group.model';

import {
  createGroup,
  createGroupFail,
  createGroupSuccess,
  loadGroups,
  loadGroupsFail,
  loadGroupsSuccess,
} from './organization-hierarchies.actions';

export const groupAdapter = createEntityAdapter<Group>({
  selectId: group => group.id,
});

export interface OrganizationHierarchiesState extends EntityState<Group> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

const initialState: OrganizationHierarchiesState = groupAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const organizationHierarchiesReducer = createReducer(
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
      selected: group.id,
    };
  })
);
