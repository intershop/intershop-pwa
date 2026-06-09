import { TransferState, makeStateKey } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, ActionReducer, Store, UPDATE } from '@ngrx/store';
import { pick } from 'lodash-es';
import { first, map, take } from 'rxjs/operators';

import { CoreState } from 'ish-core/store/core/core-store';
import { mergeDeep } from 'ish-core/utils/functions';

export const NGRX_STATE_SK = makeStateKey<object>('ngrxState');

const STATE_ACTION_TYPE = '[Internal] Import NgRx State';

let transferredState: Record<string, unknown>;

/**
 * Meta reducer for hydrating server side state on the client side if supplied by SSR.
 * Initially (STATE_ACTION_TYPE) all already registered slices are hydrated, then removed from the transferred state.
 * On subsequent updates (UPDATE), only features that are still in the transferred state are applied, then removed from the transferred state.
 * This allows to apply the transferred state in parts and only once, e.g. as features are loaded, and prevents transferred state from being lost if the store is updated before a feature is loaded.
 */
export function ngrxStateTransferMeta(reducer: ActionReducer<CoreState>): ActionReducer<CoreState> {
  return (state: CoreState, action: { payload: Record<string, unknown>; features: string[] } & Action) => {
    if (action.type === STATE_ACTION_TYPE) {
      // keep a mutable copy — slices are removed as they're applied
      transferredState = { ...action.payload };
      const registered = Object.keys(state ?? {});
      const applicable = pick(transferredState, ...registered);
      registered.forEach(k => delete transferredState[k]);
      return mergeDeep(state, applicable);
    }
    if (action.type === UPDATE && transferredState && Object.keys(transferredState).length) {
      const newFeatures = action.features ?? [];
      const applicable = pick(transferredState, ...newFeatures);
      if (Object.keys(applicable).length) {
        newFeatures.forEach(k => delete transferredState[k]);
        return reducer({ ...state, ...applicable }, action);
      }
    }
    return reducer(state, action);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic store can only be used as any
export function filterState(store: any, maxLevel: number): object {
  if (maxLevel > 0 && store && typeof store === 'object' && !(store instanceof Array)) {
    return Object.keys(store)
      .filter(k => !k.startsWith('_'))
      .map(k => ({ [k]: filterState(store[k], maxLevel - 1) }))
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
        store
          .pipe(
            take(1),
            map(s => filterState(s, 2))
          )
          .subscribe((saveState: object) => {
            state = saveState;
          });

        return state;
      });
    }
  };
}
