import { Action, ActionReducer } from '@ngrx/store';

import { logoutUser } from 'ish-core/store/customer/user';

export function resetOnLogoutMeta(reducer: ActionReducer<{}>): ActionReducer<{}> {
  return (state: {}, action: Action) => {
    if (action.type === logoutUser.type) {
      return reducer({}, action);
    }
    return reducer(state, action);
  };
}
