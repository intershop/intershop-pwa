import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import { loadGroup, loadGroupFail, loadGroupSuccess } from './group.actions';

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
  setLoadingOn(loadGroup),
  setErrorOn(loadGroupFail),
  on(loadGroupSuccess, (state: GroupState, action) => {
    const { group } = action.payload;
    return {
      ...groupAdapter.upsertMany(group, state),
      loading: false,
      error: undefined,
    };
  })
);
