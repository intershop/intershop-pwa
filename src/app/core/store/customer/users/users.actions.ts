import { createAction } from '@ngrx/store';

import { B2bUser } from 'ish-core/models/b2b-user/b2b-user.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadCustomerUsers = createAction('[Users Internal] Load Users of Customer');

export const loadCustomerUsersFail = createAction('[Users API] Load Users of Customer Fail', httpError());

export const loadCustomerUsersSuccess = createAction(
  '[Users API] Load Users of Customer Success',
  payload<{ users: B2bUser[] }>()
);
