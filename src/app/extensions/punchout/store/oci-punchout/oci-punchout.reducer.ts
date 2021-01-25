import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

import {
  addPunchoutUser,
  addPunchoutUserFail,
  addPunchoutUserSuccess,
  deletePunchoutUser,
  deletePunchoutUserFail,
  deletePunchoutUserSuccess,
  loadPunchoutUsers,
  loadPunchoutUsersFail,
  loadPunchoutUsersSuccess,
  startOCIPunchout,
  startOCIPunchoutFail,
  startOCIPunchoutSuccess,
  updatePunchoutUser,
  updatePunchoutUserFail,
  updatePunchoutUserSuccess,
} from './oci-punchout.actions';

export const ociPunchoutAdapter = createEntityAdapter<PunchoutUser>();

export interface OciPunchoutState extends EntityState<PunchoutUser> {
  loading: boolean;
  error: HttpError;
}

export const initialState: OciPunchoutState = ociPunchoutAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const ociPunchoutReducer = createReducer(
  initialState,
  setLoadingOn(loadPunchoutUsers, addPunchoutUser, updatePunchoutUser, deletePunchoutUser, startOCIPunchout),
  setErrorOn(
    loadPunchoutUsersFail,
    addPunchoutUserFail,
    updatePunchoutUserFail,
    deletePunchoutUserFail,
    startOCIPunchoutFail
  ),
  unsetLoadingAndErrorOn(
    loadPunchoutUsersSuccess,
    addPunchoutUserSuccess,
    updatePunchoutUserSuccess,
    deletePunchoutUserSuccess,
    startOCIPunchoutSuccess
  ),

  on(loadPunchoutUsersSuccess, (state, action) => ociPunchoutAdapter.upsertMany(action.payload.users, state)),
  on(addPunchoutUserSuccess, (state, action) => ociPunchoutAdapter.addOne(action.payload.user, state)),
  on(updatePunchoutUserSuccess, (state, action) => ociPunchoutAdapter.upsertOne(action.payload.user, state)),
  on(deletePunchoutUserSuccess, (state, action) => ociPunchoutAdapter.removeOne(action.payload.login, state))
);
