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
  updatePunchoutUser,
  updatePunchoutUserFail,
  updatePunchoutUserSuccess,
} from './punchout-users.actions';

export const punchoutUsersAdapter = createEntityAdapter<PunchoutUser>();

export interface PunchoutUsersState extends EntityState<PunchoutUser> {
  loading: boolean;
  error: HttpError;
}

export const initialState: PunchoutUsersState = punchoutUsersAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const punchoutUsersReducer = createReducer(
  initialState,
  setLoadingOn(loadPunchoutUsers, addPunchoutUser, updatePunchoutUser, deletePunchoutUser),
  setErrorOn(loadPunchoutUsersFail, addPunchoutUserFail, updatePunchoutUserFail, deletePunchoutUserFail),
  unsetLoadingAndErrorOn(
    loadPunchoutUsersSuccess,
    addPunchoutUserSuccess,
    updatePunchoutUserSuccess,
    deletePunchoutUserSuccess
  ),

  on(loadPunchoutUsersSuccess, (state, action) => punchoutUsersAdapter.upsertMany(action.payload.users, state)),
  on(addPunchoutUserSuccess, (state, action) => punchoutUsersAdapter.addOne(action.payload.user, state)),
  on(updatePunchoutUserSuccess, (state, action) => punchoutUsersAdapter.upsertOne(action.payload.user, state)),
  on(deletePunchoutUserSuccess, (state, action) => punchoutUsersAdapter.removeOne(action.payload.login, state))
);
