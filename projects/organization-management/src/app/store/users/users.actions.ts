import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';

export const loadUsers = createAction('[Users] Load Users');

export const loadUsersFail = createAction('[Users API] Load Users Fail', httpError());

export const loadUsersSuccess = createAction('[Users API] Load Users Success', payload<{ users: B2bUser[] }>());

export const loadUserFail = createAction('[Users API] Load User Fail', httpError());

export const loadUserSuccess = createAction('[Users API] Load User Success', payload<{ user: B2bUser }>());

export const resetUsers = createAction('[Users] Reset Users');
