import { FactoryProvider, Optional } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, ActionReducer, Store } from '@ngrx/store';

import { CoreState } from 'ish-core/store/core/core-store';

// tslint:disable:no-console

export const containsActionWithType = (type: string) => (actions: Action[]) =>
  !!actions.filter(a => a.type === type).length;

/**
 * meta reducer for logging actions to the console
 */
export function logActionsMeta<T = object>(reducer: ActionReducer<T>): ActionReducer<T> {
  return (state: T, action: Action) => {
    if (action.type !== '@ngrx/store-devtools/recompute') {
      console.log('action', action);
    }
    return reducer(state, action);
  };
}

/**
 * meta reducer for logging the state after every modification to the console
 */
export function logStateMeta<T = object>(reducer: ActionReducer<T>): ActionReducer<T> {
  return (state: T, action: Action) => {
    const newState = reducer(state, action);
    console.log('state', newState);
    return newState;
  };
}

/**
 * Pseudo class for enriching ngrx {@link Store} with additional properties for testing.
 */
export abstract class StoreWithSnapshots {
  /**
   * Provides access to a synchronous snapshot of the state.
   */
  state: CoreState;

  abstract dispatch(action: Action): void;

  /**
   * Retrieve a list of actions fired since the last reset.
   * @param regex optional filter
   */
  abstract actionsArray(regex?: RegExp): Action[];

  /**
   * Reset actions history.
   */
  abstract reset(): void;
}

/**
 * Provider wrapping ngrx {@link Store} for testing.
 * use it in combination with {@link StoreWithSnapshots}.
 */
export function provideStoreSnapshots(): FactoryProvider {
  const actionList: Action[] = [];
  function saveStore(store: StoreWithSnapshots & Store, actions: Actions) {
    store.subscribe(state => (store.state = state as CoreState));
    if (actions) {
      actions.subscribe(action => {
        actionList.push(action);
      });
    }
    store.actionsArray = (regex = /.*/) => actionList.filter(action => regex.test(action.type));
    store.reset = () => actionList.splice(0, actionList.length);
    return store;
  }

  return {
    provide: StoreWithSnapshots,
    useFactory: saveStore,
    deps: [Store, [new Optional(), Actions]],
  };
}
