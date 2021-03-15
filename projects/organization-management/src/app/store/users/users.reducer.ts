import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

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
  setUserBudget,
  setUserBudgetFail,
  setUserBudgetSuccess,
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
  setLoadingOn(loadUsers, addUser, updateUser, deleteUser, setUserBudget),
  unsetLoadingAndErrorOn(
    loadUsersSuccess,
    loadUserSuccess,
    addUserSuccess,
    updateUserSuccess,
    deleteUserSuccess,
    setUserBudgetSuccess
  ),
  setErrorOn(
    loadUsersFail,
    loadUserFail,
    addUserFail,
    updateUserFail,
    deleteUserFail,
    setUserRolesFail,
    setUserBudgetFail
  ),
  on(loadUsersSuccess, (state, action) => {
    const { users } = action.payload;

    return {
      ...usersAdapter.upsertMany(users, state),
      // preserve order from API
      ids: users.map(u => u.login),
    };
  }),
  on(loadUserSuccess, (state, action) => {
    const { user } = action.payload;

    return {
      ...usersAdapter.upsertOne(user, state),
    };
  }),
  on(addUserSuccess, (state, action) => {
    const { user } = action.payload;

    return {
      ...usersAdapter.addOne(user, state),
    };
  }),
  on(updateUserSuccess, (state, action) => {
    const { user } = action.payload;

    return {
      ...usersAdapter.upsertOne(user, state),
    };
  }),
  on(deleteUserSuccess, (state, action) => {
    const { login } = action.payload;

    return {
      ...usersAdapter.removeOne(login, state),
    };
  }),
  on(loadSystemUserRolesSuccess, (state, action) => ({
    ...state,
    roles: action.payload.roles,
  })),
  on(setUserRolesSuccess, (state, action) =>
    usersAdapter.updateOne({ id: action.payload.login, changes: { roleIDs: action.payload.roles } }, state)
  ),
  on(setUserBudgetSuccess, (state, action) => ({
    ...usersAdapter.updateOne({ id: action.payload.login, changes: { userBudget: action.payload.budget } }, state),
  }))
);
