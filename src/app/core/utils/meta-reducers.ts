import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { logoutUser } from 'ish-core/store/customer/user';

export function resetOnLogoutMeta(reducer: ActionReducer<{}>): ActionReducer<{}> {
  return (state: {}, action: Action) => {
    if (action.type === logoutUser.type) {
      return reducer({}, action);
    }
    return reducer(state, action);
  };
}

export function localStorageSaveMeta<S>(prefix: string, key: keyof S & string): MetaReducer<S, Action> {
  if (!key?.startsWith('_')) {
    console.warn('localStorageSaveMeta:', `store key ${prefix}-${key} is not excluded from universal state transfer.`);
  }
  const item = `${prefix}-${key}`;
  return (reducer): ActionReducer<S> => (state: S, action: Action) => {
    if (typeof window !== 'undefined' && action.type !== '@ngrx/store-devtools/recompute') {
      let incomingState = state;
      if (!incomingState?.[key]) {
        const fromStorage = localStorage.getItem(item);
        if (fromStorage) {
          incomingState = { ...state, [key]: JSON.parse(fromStorage) };
        }
      }
      const newState = reducer(incomingState, action);
      if (newState?.[key] !== state?.[key] && !isEqual(newState?.[key], state?.[key])) {
        localStorage.setItem(item, JSON.stringify(newState?.[key]));
      }
      return newState;
    }
    return reducer(state, action);
  };
}
