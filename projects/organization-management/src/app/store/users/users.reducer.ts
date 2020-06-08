import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

import { UsersAction, UsersActionTypes } from './users.actions';

export const usersAdapter = createEntityAdapter<User>({
  selectId: user => user.businessPartnerNo,
});

export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: HttpError;
}

const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export function usersReducer(state = initialState, action: UsersAction): UsersState {
  switch (action.type) {
    case UsersActionTypes.LoadUsersBudgets:
    case UsersActionTypes.LoadUserBudgets:
    case UsersActionTypes.LoadUsers: {
      return {
        ...state,
        loading: true,
      };
    }

    case UsersActionTypes.LoadUserBudgetsFail:
    case UsersActionTypes.LoadUsersFail: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
      };
    }

    case UsersActionTypes.LoadUsersSuccess: {
      const { users } = action.payload;

      return {
        ...usersAdapter.upsertMany(users, state),
        loading: false,
        error: undefined,
      };
    }

    case UsersActionTypes.LoadUserBudgetsSuccess: {
      const { user, userBudgets } = action.payload;

      return {
        ...usersAdapter.upsertOne({ ...user, budgets: userBudgets }, state),
        loading: false,
        error: undefined,
      };
    }
  }

  return state;
}
