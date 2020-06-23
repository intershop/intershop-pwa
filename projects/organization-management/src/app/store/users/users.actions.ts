import { createAction } from '@ngrx/store';

import { User } from 'ish-core/models/user/user.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadUsers = createAction('[Users] Load Users');

export const loadUsersFail = createAction('[Users API] Load Users Fail', httpError());

export const loadUsersSuccess = createAction('[Users API] Load Users Success', payload<{ users: User[] }>());

export const loadUserFail = createAction('[Users API] Load User Fail', httpError());

export const loadUserSuccess = createAction('[Users API] Load User Success', payload<{ user: User }>());

export const resetUsers = createAction('[Users] Reset Users');
