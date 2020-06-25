import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { B2bRole } from '../../models/b2b-role/b2b-role.model';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import {
  addUser,
  addUserFail,
  addUserSuccess,
  deleteUser,
  deleteUserFail,
  deleteUserSuccess,
  loadSystemUserRolesSuccess,
  loadUserFail,
  loadUserSuccess,
  loadUsers,
  loadUsersFail,
  loadUsersSuccess,
  setUserBudgets,
  setUserBudgetsFail,
  setUserBudgetsSuccess,
  setUserRolesFail,
  setUserRolesSuccess,
  updateUser,
  updateUserFail,
  updateUserSuccess,
} from './users.actions';

export const usersAdapter = createEntityAdapter<B2bUser>({
  selectId: user => user.login,
});

export interface UsersState extends EntityState<B2bUser> {
  loading: boolean;
  error: HttpError;
  roles: B2bRole[];
}

const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: undefined,
  roles: [],
});

export const usersReducer = createReducer(
  initialState,
  setLoadingOn(loadUsers, addUser, updateUser, deleteUser, setUserBudgets),
  setErrorOn(
    loadUsersFail,
    loadUserFail,
    addUserFail,
    updateUserFail,
    deleteUserFail,
    setUserRolesFail,
    setUserBudgetsFail
  ),
  on(loadUsersSuccess, (state: UsersState, action) => {
    const { users } = action.payload;

    return {
      ...usersAdapter.upsertMany(users, state),
      // preserve order from API
      ids: users.map(u => u.login),
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
  on(addUserSuccess, (state: UsersState, action) => {
    const { user } = action.payload;

    return {
      ...usersAdapter.addOne(user, state),
      loading: false,
      error: undefined,
    };
  }),
  on(updateUserSuccess, (state: UsersState, action) => {
    const { user } = action.payload;

    return {
      ...usersAdapter.upsertOne(user, state),
      loading: false,
      error: undefined,
    };
  }),
  on(deleteUserSuccess, (state: UsersState, action) => {
    const { login } = action.payload;

    return {
      ...usersAdapter.removeOne(login, state),
      loading: false,
      error: undefined,
    };
  }),
  on(loadSystemUserRolesSuccess, (state, action) => ({
    ...state,
    roles: action.payload.roles,
  })),
  on(setUserRolesSuccess, (state, action) =>
    usersAdapter.updateOne({ id: action.payload.login, changes: { roleIDs: action.payload.roles } }, state)
  ),
  on(setUserBudgetsSuccess, (state, action) => ({
    ...usersAdapter.updateOne({ id: action.payload.login, changes: { budgets: action.payload.budgets } }, state),
    loading: false,
    error: undefined,
  }))
);
