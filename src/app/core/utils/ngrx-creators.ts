import { ActionCreator, On, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

export function payload<P>() {
  return (args: P) => ({ payload: { ...args } });
}

export function httpError<P = {}>() {
  return (args: { error: HttpError } & P) => ({ payload: { ...args } });
}

export function setLoadingOn<S extends { loading: boolean | number }>(...actionCreators: ActionCreator[]): On<S> {
  const stateFnc = (state: S) => ({
    ...state,
    loading: typeof state.loading === 'boolean' ? true : state.loading + 1,
  });
  if (actionCreators.length === 1) {
    return on(actionCreators[0], stateFnc);
  } else {
    return on(actionCreators[0], ...actionCreators.splice(1), stateFnc);
  }
}

function calculateLoading<T extends boolean | number, S extends { loading: T }>(state: S): T {
  if (typeof state.loading === 'number' && state.loading - 1 < 0) {
    console.warn('State loading would be decreased below 0.');
  }
  return (typeof state.loading === 'boolean' ? false : Math.max((state.loading as number) - 1, 0)) as T;
}

export function unsetLoadingAndErrorOn<S extends { loading: boolean | number }>(
  ...actionCreators: ActionCreator[]
): On<S> {
  const stateFnc = (state: S) => ({
    ...state,
    loading: calculateLoading(state),
    error: undefined,
  });
  if (actionCreators.length === 1) {
    return on(actionCreators[0], stateFnc);
  } else {
    return on(actionCreators[0], ...actionCreators.splice(1), stateFnc);
  }
}

export function setErrorOn<S extends { loading: boolean | number; error: HttpError }>(
  ...actionCreators: ActionCreator[]
): On<S> {
  const stateFnc = (state: S, action: { payload: { error: HttpError }; type: string }) => ({
    ...state,
    error: action.payload.error,
    loading: calculateLoading(state),
  });
  if (actionCreators.length === 1) {
    return on(actionCreators[0], stateFnc);
  } else {
    return on(actionCreators[0], ...actionCreators.splice(1), stateFnc);
  }
}
