import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import { loadUserFail, loadUserSuccess, loadUsers, loadUsersFail, loadUsersSuccess, resetUsers } from './users.actions';

export const usersAdapter = createEntityAdapter<B2bUser>({
  selectId: user => user.login,
});

export interface UsersState extends EntityState<B2bUser> {
  loading: boolean;
  error: HttpError;
}

const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const usersReducer = createReducer(
  initialState,
  setLoadingOn(loadUsers),
  setErrorOn(loadUsersFail, loadUserFail),
  on(loadUsersSuccess, (state: UsersState, action) => {
    const { users } = action.payload;

    return {
      ...usersAdapter.upsertMany(users, state),
      loading: false,
      error: undefined,
    };
  }),
  on(loadUserSuccess, (state: UsersState, action) => {
    const { user } = action.payload;

    return {
      ...usersAdapter.upsertOne(user, state),
      loading: false,
      error: undefined,
    };
  }),
  on(resetUsers, () => initialState)
);
