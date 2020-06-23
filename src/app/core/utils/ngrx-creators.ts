import { ActionCreator, On, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

export function payload<P>() {
  return (args: P) => ({ payload: { ...args } });
}

export function httpError<P = {}>() {
  return (args: { error: HttpError } & P) => ({ payload: { ...args } });
}

export function setLoadingOn<S extends { loading: boolean }>(...actionCreators: ActionCreator[]): On<S> {
  const stateFnc = (state: S) => ({
    ...state,
    loading: true,
  });
  if (actionCreators.length === 1) {
    return on(actionCreators[0], stateFnc);
  } else {
    return on(actionCreators[0], ...actionCreators.splice(1), stateFnc);
  }
}

export function setErrorOn<S extends { loading: boolean; error: HttpError }>(
  ...actionCreators: ActionCreator[]
): On<S> {
  const stateFnc = (state: S, action: { payload: { error: HttpError }; type: string }) => ({
    ...state,
    error: action.payload.error,
    loading: false,
  });
  if (actionCreators.length === 1) {
    return on(actionCreators[0], stateFnc);
  } else {
    return on(actionCreators[0], ...actionCreators.splice(1), stateFnc);
  }
}
