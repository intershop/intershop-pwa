import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Actions } from '@ngrx/effects';
import { ActionReducer, Store } from '@ngrx/store';
import { first, map, take } from 'rxjs/operators';

import { mergeDeep } from 'ish-core/utils/functions';

// tslint:disable:no-any

const NGRX_STATE_SK = makeStateKey('ngrxState');
const STATE_ACTION_TYPE = '[Internal] Import NgRx State';

/**
 * meta reducer for overriding client side state if supplied by server
 */
export function ngrxStateTransferMeta(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any) => {
    if (action.type === STATE_ACTION_TYPE) {
      return mergeDeep(state, action.payload);
    }
    return reducer(state, action);
  };
}

export function filterState(store) {
  if (store && typeof store === 'object' && !(store instanceof Array)) {
    return Object.keys(store)
      .filter(k => !k.startsWith('_'))
      .map(k => ({ [k]: filterState(store[k]) }))
      .reduce((acc, val) => ({ ...acc, ...val }), {});
  } else {
    return store;
  }
}

/**
 * Sets state on server-side, re-hydrates on client side.
 * inspired by https://github.com/ngrx/platform/issues/101#issuecomment-351998548
 */
export function ngrxStateTransfer(transferState: TransferState, store: Store<{}>, actions: Actions) {
  return () => {
    if (transferState.hasKey<any>(NGRX_STATE_SK)) {
      // browser
      actions.pipe(first()).subscribe(() => {
        const state = transferState.get<any>(NGRX_STATE_SK, undefined);
        transferState.remove(NGRX_STATE_SK);
        store.dispatch({ type: STATE_ACTION_TYPE, payload: state });
      });
    } else {
      // server
      transferState.onSerialize(NGRX_STATE_SK, () => {
        let state;
        store.pipe(take(1), map(filterState)).subscribe((saveState: any) => {
          state = saveState;
        });

        return state;
      });
    }
  };
}
