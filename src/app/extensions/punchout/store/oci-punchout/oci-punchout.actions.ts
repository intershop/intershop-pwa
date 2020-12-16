import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

export const loadPunchoutUsers = createAction('[Punchout] Load Punchout Users');

export const loadPunchoutUsersFail = createAction('[Punchout API] Load Punchout Users Fail', httpError());

export const loadPunchoutUsersSuccess = createAction(
  '[Punchout API] Load Punchout Users Success',
  payload<{ users: PunchoutUser[] }>()
);
