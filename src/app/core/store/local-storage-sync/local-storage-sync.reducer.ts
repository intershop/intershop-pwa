// tslint:disable:no-any
import { Action, ActionReducer } from '@ngrx/store';
import { localStorageSync, rehydrateApplicationState } from 'ngrx-store-localstorage';

import { CoreState } from '../core.state';

// https://github.com/btroncone/ngrx-store-localstorage/issues/40#issuecomment-336283880

const STORAGE = '@ngrx/store/storage';

/**
 * To enable two way binding of all tabs set value to true. This will add the possibility to listen to changes of another tab for update.
 */
const bindAllTabs = false;

/**
 * Parts of the state that should be synced
 */
const keys = ['checkout', 'countries', 'locale', 'shopping', 'user', 'quoting', 'orders'];

export class Storage implements Action {
  readonly type = STORAGE;
  constructor(public payload: string) {}
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: CoreState, action: any) => {
    if (action.type === STORAGE && keys.includes(action.payload)) {
      if (bindAllTabs && localStorage) {
        const rehydratedState = rehydrateApplicationState([action.payload], localStorage, k => k, true);
        return { ...state, ...rehydratedState };
      }
      return state;
    }
    return localStorageSync({
      keys,
      rehydrate: true,
      restoreDates: true,
    })(reducer)(state, action);
  };
}
