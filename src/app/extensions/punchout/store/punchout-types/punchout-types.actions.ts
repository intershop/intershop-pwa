import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { PunchoutType } from '../../models/punchout-user/punchout-user.model';

export const loadPunchoutTypes = createAction('[Punchout] Load Punchout Types');

export const loadPunchoutTypesFail = createAction('[Punchout API] Load Punchout Types Fail', httpError());

export const loadPunchoutTypesSuccess = createAction(
  '[Punchout API] Load Punchout Types Success',
  payload<{ types: PunchoutType[] }>()
);
