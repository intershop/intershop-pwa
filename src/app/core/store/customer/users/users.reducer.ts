import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { B2bUser } from 'ish-core/models/b2b-user/b2b-user.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { loadCustomerUsers, loadCustomerUsersFail, loadCustomerUsersSuccess } from './users.actions';

export const usersAdapter = createEntityAdapter<B2bUser>({
  selectId: user => user.login,
});

export type UsersState = EntityState<B2bUser>;

const initialState: UsersState = usersAdapter.getInitialState({});

export const usersReducer = createReducer(
  initialState,
  setLoadingOn(loadCustomerUsers),
  unsetLoadingAndErrorOn(loadCustomerUsersSuccess),
  setErrorOn(loadCustomerUsersFail),
  on(loadCustomerUsersSuccess, (state, action) => {
    const { users } = action.payload;

    return {
      ...usersAdapter.upsertMany(users, state),
      // preserve order from API
      ids: users.map(u => u.login),
    };
  })
);
