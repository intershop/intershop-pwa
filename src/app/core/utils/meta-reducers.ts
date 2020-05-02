import { Action, ActionReducer } from '@ngrx/store';

import { UserActionTypes } from 'ish-core/store/account/user';

export function resetOnLogoutMeta(reducer: ActionReducer<{}>): ActionReducer<{}> {
  return (state: {}, action: Action) => {
    if (action.type === UserActionTypes.LogoutUser) {
      return reducer({}, action);
    }
    return reducer(state, action);
  };
}
