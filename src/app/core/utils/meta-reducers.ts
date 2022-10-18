import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { identity } from 'rxjs';

import { logoutUserSuccess } from 'ish-core/store/customer/user';

import { omit } from './functions';

export function resetOnLogoutMeta<S>(reducer: ActionReducer<S>): ActionReducer<S> {
  return (state: S, action: Action) => {
    if (action.type === logoutUserSuccess.type) {
      return reducer(undefined, action);
    }
    return reducer(state, action);
  };
}

export function resetSubStatesOnActionsMeta<S>(subStates: (keyof S)[], actions: Action[]): MetaReducer<S, Action> {
  return (reducer): ActionReducer<S> =>
    (state: S, action: Action) => {
      if (actions?.some(a => a.type === action.type)) {
        return reducer(omit<S>(state, ...subStates) as S, action);
      }
      return reducer(state, action);
    };
}

function saveMeta<S>(
  storage: Storage,
  baseHref: string,
  prefix: string,
  key: keyof S & string,
  lifeTimeMinutes?: number
): MetaReducer<S, Action> {
  if (!key?.startsWith('_')) {
    console.warn('saveMeta:', `store key ${prefix}/${key} is not excluded from universal state transfer.`);
  }
  const item = `${baseHref}-${prefix}-${key}`;
  return (reducer): ActionReducer<S> =>
    (state: S, action: Action) => {
      if (typeof window !== 'undefined' && action.type !== '@ngrx/store-devtools/recompute') {
        let incomingState = state;
        if (!incomingState?.[key]) {
          const fromStorage = storage.getItem(item);
          if (fromStorage) {
            const fromStorageParsed = JSON.parse(fromStorage);
            const timeoutCheck =
              lifeTimeMinutes === undefined ||
              lifeTimeMinutes * 60 * 1000 + fromStorageParsed.sync > new Date().getTime();
            if (timeoutCheck) {
              incomingState = { ...state, [key]: fromStorageParsed.data };
            } else {
              storage.setItem(item, undefined);
            }
          }
        }
        const newState = reducer(incomingState, action);
        if (newState?.[key] !== state?.[key] && !isEqual(newState?.[key], state?.[key])) {
          storage.setItem(item, JSON.stringify({ sync: new Date().getTime(), data: newState?.[key] }));
        }
        return newState;
      }
      return reducer(state, action);
    };
}

const localStorageSaveMeta = <S>(baseHref: string, prefix: string, key: keyof S & string, lifeTimeMinutes?: number) =>
  saveMeta<S>(localStorage, baseHref, prefix, key, lifeTimeMinutes);

const sessionStorageSaveMeta = <S>(baseHref: string, prefix: string, key: keyof S & string) =>
  saveMeta<S>(sessionStorage, baseHref, prefix, key);

type DataRetentionPolicyValue = 'session' | number | 'forever';

export type DataRetentionPolicy = Record<string, DataRetentionPolicyValue>;

export function dataRetentionMeta<S>(
  policy: DataRetentionPolicyValue,
  baseHref: string,
  prefix: string,
  key: keyof S & string
) {
  if (policy === 'session') {
    return sessionStorageSaveMeta<S>(baseHref, prefix, key);
  } else if (policy === 'forever') {
    return localStorageSaveMeta<S>(baseHref, prefix, key);
  } else if (typeof policy === 'number') {
    return localStorageSaveMeta<S>(baseHref, prefix, key, policy);
  } else {
    return identity;
  }
}
