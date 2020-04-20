import { Injectable, Type } from '@angular/core';
import { Actions, Effect, EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { Action, ActionReducer, ActionReducerMap, RootStoreConfig, Store, StoreModule } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { CustomRouterSerializer } from 'ish-core/store/router/router.serializer';

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

export function logActionsMeta(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any) => {
    if (action.type !== '@ngrx/store-devtools/recompute') {
      console.log('action', action);
    }
    return reducer(state, action);
  };
}

export function logStateMeta(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any) => {
    const newState = reducer(state, action);
    console.log('state', newState);
    return newState;
  };
}

/**
 * Service for monitoring actions and the current state.
 * ! The listening is solved as Effects so it can be managed by the EffectsModule.
 * ! Otherwise the order of the actions is interferred with.
 */
@Injectable()
export class TestStore {
  private actions: Action[] = [];
  state: any;

  constructor(private actions$: Actions, private store$: Store<{}>) {}

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
