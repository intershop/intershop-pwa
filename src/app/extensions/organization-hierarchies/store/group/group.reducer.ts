import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import { loadGroups, loadGroupsFail, loadGroupsSuccess } from './group.actions';

export const groupAdapter = createEntityAdapter<OrganizationGroup>();

export interface GroupState extends EntityState<OrganizationGroup> {
  loading: boolean;
  error: HttpError;
}

const initialState: GroupState = groupAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const groupReducer = createReducer(
  initialState,
  setLoadingOn(loadGroups),
  setErrorOn(loadGroupsFail),
  on(loadGroupsSuccess, (state: GroupState, action) => {
    const { groups } = action.payload;
    return {
      ...groupAdapter.upsertMany(groups, state),
      loading: false,
      error: undefined,
    };
  })
);
