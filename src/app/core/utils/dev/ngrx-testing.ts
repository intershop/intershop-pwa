import { Injectable, Optional, Type } from '@angular/core';
import { Actions, Effect, EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { Action, ActionReducer, ActionReducerMap, RootStoreConfig, Store, StoreModule } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { CoreState } from 'ish-core/store/core/core-store';
import { CustomRouterSerializer } from 'ish-core/store/core/router/router.serializer';

// tslint:disable:no-any no-console

export const containsActionWithType = (type: string) => (actions: Action[]) =>
  !!actions.filter(a => a.type === type).length;

export const containsActionWithTypeAndPayload = (type: string, predicate: (payload: any) => boolean) => (
  actions: { type: string; payload: unknown }[]
) => !!actions.filter(a => a.type === type && predicate(a.payload)).length;

function includeAction(action: Action, include: string[] | RegExp) {
  const type = action.type;
  return include instanceof Array ? include.some(inc => type.indexOf(inc) >= 0) : type.search(include) >= 0;
}

/**
 * meta reducer for logging actions to the console
 */
export function logActionsMeta(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any) => {
    if (action.type !== '@ngrx/store-devtools/recompute') {
      console.log('action', action);
    }
    return reducer(state, action);
  };
}

/**
 * meta reducer for logging the state after every modification to the console
 */
export function logStateMeta(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any) => {
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
export function provideStoreSnapshots() {
  const actionList: Action[] = [];
  // tslint:disable: no-string-literal
  function saveStore(store: Store, actions: Actions) {
    store.subscribe(state => (store['state'] = state));
    if (actions) {
      actions.subscribe(action => {
        actionList.push(action);
      });
    }
    store['actionsArray'] = (regex = /.*/) => actionList.filter(action => regex.test(action.type));
    store['reset'] = () => actionList.splice(0, actionList.length);
    return store;
  }
  // tslint:enable: no-string-literal

  return [
    {
      provide: StoreWithSnapshots,
      useFactory: saveStore,
      deps: [Store, [new Optional(), Actions]],
    },
  ];
}

// tslint:disable: deprecation

/**
 * Service for monitoring actions and the current state.
 * ! The listening is solved as Effects so it can be managed by the EffectsModule.
 * ! Otherwise the order of the actions is interferred with.
 * @deprecated will be removed in version 0.23
 */
@Injectable()
export class TestStore {
  private actions: Action[] = [];
  state: any;

  constructor(private actions$: Actions, private store$: Store) {}

  @Effect({ dispatch: false })
  logActions$ = this.actions$.pipe(tap(action => this.actions.push(action)));

  @Effect({ dispatch: false })
  logState$ = this.store$.pipe(tap(state => (this.state = JSON.parse(JSON.stringify(state)))));

  dispatch(action: Action) {
    this.store$.dispatch(action);
  }

  reset() {
    this.actions = [];
  }

  actionsArray(include: string[] | RegExp = /.*/) {
    return this.actions
      .filter(current => !!current && !!current.type)
      .filter(current => includeAction(current, include));
  }
}

/** @deprecated will be removed in version 0.23 */
export function ngrxTesting<T>(
  options: {
    reducers?: ActionReducerMap<T, Action>;
    effects?: Type<any>[];
    config?: RootStoreConfig<T>;
    routerStore?: boolean;
    logActions?: boolean;
    logState?: boolean;
  } = {}
) {
  let reducers = options.reducers || ({} as ActionReducerMap<T, Action>);

  if (options.routerStore) {
    reducers = { ...reducers, router: routerReducer };
  }

  const config = options.config || {};
  config.metaReducers = config.metaReducers || [];
  if (options.logActions) {
    config.metaReducers = [logActionsMeta, ...config.metaReducers];
  }
  if (options.logState) {
    config.metaReducers = [logStateMeta, ...config.metaReducers];
  }

  const array = [
    StoreModule.forRoot(reducers, {
      ...config,
      runtimeChecks: {
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateImmutability: true,
        strictStateSerializability: true,
      },
    }),
    EffectsModule.forRoot([TestStore, ...(options.effects || [])]),
  ];

  if (options.routerStore) {
    array.push(StoreRouterConnectingModule.forRoot({ serializer: CustomRouterSerializer }));
  }

  return array;
}
