import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

export const loadPunchoutUsers = createAction('[Punchout] Load Punchout Users');

export const loadPunchoutUsersFail = createAction('[Punchout API] Load Punchout Users Fail', httpError());

export const loadPunchoutUsersSuccess = createAction(
  '[Punchout API] Load Punchout Users Success',
  payload<{ users: PunchoutUser[] }>()
);

export const addPunchoutUser = createAction('[Punchout] Add Punchout User', payload<{ user: PunchoutUser }>());

export const addPunchoutUserFail = createAction('[Punchout API] Add Punchout User Fail', httpError());

export const addPunchoutUserSuccess = createAction(
  '[Punchout API] Add Punchout User Success',
  payload<{ user: PunchoutUser }>()
);

export const deletePunchoutUser = createAction('[Punchout] Delete Punchout User', payload<{ login: string }>());

export const deletePunchoutUserFail = createAction('[Punchout API] Delete Punchout User Fail', httpError());

export const deletePunchoutUserSuccess = createAction(
  '[Punchout API] Punchout Delete User Success',
  payload<{ login: string }>()
);

export const startOCIPunchout = createAction('[Punchout] Start OCI Punchout');

export const startOCIPunchoutFail = createAction('[Punchout API] Start OCI Punchout Fail', httpError());

export const startOCIPunchoutSuccess = createAction('[Punchout API] Start OCI Punchout Success');
