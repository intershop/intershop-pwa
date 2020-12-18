import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

import {
  addPunchoutUser,
  addPunchoutUserFail,
  addPunchoutUserSuccess,
  loadPunchoutUsers,
  loadPunchoutUsersFail,
  loadPunchoutUsersSuccess,
} from './oci-punchout.actions';

export const ociPunchoutAdapter = createEntityAdapter<PunchoutUser>();

export interface OciPunchoutState extends EntityState<PunchoutUser> {
  loading: boolean;
  error: HttpError;
}

const initialState: OciPunchoutState = ociPunchoutAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const ociPunchoutReducer = createReducer(
  initialState,
  setLoadingOn(loadPunchoutUsers, addPunchoutUser),
  setErrorOn(loadPunchoutUsersFail, addPunchoutUserFail),
  unsetLoadingAndErrorOn(loadPunchoutUsersSuccess, addPunchoutUserSuccess),

  on(loadPunchoutUsersSuccess, (state, action) => ociPunchoutAdapter.upsertMany(action.payload.users, state)),
  on(addPunchoutUserSuccess, (state, action) => ociPunchoutAdapter.addOne(action.payload.user, state))
);
