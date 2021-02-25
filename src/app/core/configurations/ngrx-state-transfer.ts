import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Actions } from '@ngrx/effects';
import { Action, ActionReducer, Store } from '@ngrx/store';
import { first, map, take } from 'rxjs/operators';

import { CoreState } from 'ish-core/store/core/core-store';
import { mergeDeep } from 'ish-core/utils/functions';

export const NGRX_STATE_SK = makeStateKey<object>('ngrxState');

const STATE_ACTION_TYPE = '[Internal] Import NgRx State';

/**
 * meta reducer for overriding client side state if supplied by server
 */
export function ngrxStateTransferMeta(reducer: ActionReducer<CoreState>): ActionReducer<CoreState> {
  return (state: CoreState, action: Action & { payload: unknown }) => {
    if (action.type === STATE_ACTION_TYPE) {
      return mergeDeep(state, action.payload);
    }
    return reducer(state, action);
  };
}

// tslint:disable-next-line: no-any
export function filterState(store: any): object {
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
export function ngrxStateTransfer(transferState: TransferState, store: Store, actions: Actions) {
  return () => {
    if (transferState.hasKey(NGRX_STATE_SK)) {
      // browser
      actions.pipe(first()).subscribe(() => {
        const state = transferState.get<object>(NGRX_STATE_SK, undefined);
        transferState.remove(NGRX_STATE_SK);
        store.dispatch({ type: STATE_ACTION_TYPE, payload: state });
      });
    } else {
      // server
      transferState.onSerialize(NGRX_STATE_SK, () => {
        let state;
        store.pipe(take(1), map(filterState)).subscribe((saveState: object) => {
          state = saveState;
        });

        return state;
      });
    }
  };
}
