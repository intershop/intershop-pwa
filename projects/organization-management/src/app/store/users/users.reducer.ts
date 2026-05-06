import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { B2bRole } from '../../models/b2b-role/b2b-role.model';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

import {
  addUser,
  addUserFail,
  addUserFromCsvSingleResult,
  addUserSuccess,
  addUsersFromCsv,
  addUsersFromCsvComplete,
  addUsersFromCsvImportTotal,
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
  importResults: { user: B2bUser; status: string }[];
  importTotal: number;
}

const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: undefined,
  roles: [],
  importResults: [],
  importTotal: 0,
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
  on(loadUsersSuccess, (state, action): UsersState => {
    const { users } = action.payload;

    return {
      ...usersAdapter.upsertMany(users, state),
      // preserve order from API
      ids: users.map(u => u.login),
    };
  }),
  on(loadUserSuccess, (state, action): UsersState => {
    const { user } = action.payload;

    return {
      ...usersAdapter.upsertOne(user, state),
    };
  }),
  on(addUserSuccess, (state, action): UsersState => {
    const { user } = action.payload;

    return {
      ...usersAdapter.addOne(user, state),
    };
  }),
  on(updateUserSuccess, (state, action): UsersState => {
    const { user } = action.payload;

    return {
      ...usersAdapter.upsertOne(user, state),
    };
  }),
  on(deleteUserSuccess, (state, action): UsersState => {
    const { login } = action.payload;

    return {
      ...usersAdapter.removeOne(login, state),
    };
  }),
  on(
    addUsersFromCsv,
    (state, action): UsersState => ({
      ...state,
      loading: true,
      importResults: [],
      importTotal: action.payload.users?.length || 0,
    })
  ),
  on(addUserFromCsvSingleResult, (state, action): UsersState => {
    const { importResult } = action.payload;
    const { user } = importResult;

    if (user?.login) {
      return {
        ...usersAdapter.upsertOne(user, state),
        importResults: [...state.importResults, importResult],
      };
    }

    return {
      ...state,
      importResults: [...state.importResults, importResult],
    };
  }),
  on(
    addUsersFromCsvComplete,
    (state): UsersState => ({
      ...state,
      loading: false,
    })
  ),
  on(
    addUsersFromCsvImportTotal,
    (state, action): UsersState => ({
      ...state,
      importTotal: action.payload.totalUsers,
    })
  ),
  on(
    loadSystemUserRolesSuccess,
    (state, action): UsersState => ({
      ...state,
      roles: action.payload.roles,
    })
  ),
  on(
    setUserRolesSuccess,
    (state, action): UsersState =>
      usersAdapter.updateOne({ id: action.payload.login, changes: { roleIDs: action.payload.roles } }, state)
  ),
  on(
    setUserBudgetSuccess,
    (state, action): UsersState => ({
      ...usersAdapter.updateOne({ id: action.payload.login, changes: { userBudget: action.payload.budget } }, state),
    })
  )
);
