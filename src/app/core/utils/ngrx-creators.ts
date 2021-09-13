import { ActionCreator, createAction, on } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

export function payload<P>() {
  return (args: P) => ({ payload: { ...args } });
}

export function httpError<P = {}>() {
  return (args: { error: HttpError } & P) => ({ payload: { ...args } });
}

// tslint:disable: no-any

export function setLoadingOn<S = any>(...actionCreators: any) {
  const stateFnc = (state: any) => ({
    ...state,
    loading: typeof state.loading === 'boolean' ? true : state.loading + 1,
  });
  return on<S, any>(...actionCreators, stateFnc);
}

export function unsetLoadingOn<S = any>(...actionCreators: any) {
  const stateFnc = (state: any) => ({
    ...state,
    loading: typeof state.loading === 'boolean' ? false : state.loading - 1,
  });
  return on<S, any>(...actionCreators, stateFnc);
}

function calculateLoading<T extends boolean | number, S extends { loading: T }>(state: S): T {
  if (typeof state.loading === 'number' && state.loading - 1 < 0) {
    console.warn('State loading would be decreased below 0.');
  }
  return (typeof state.loading === 'boolean' ? false : Math.max((state.loading as number) - 1, 0)) as T;
}

export function unsetLoadingAndErrorOn<S = any>(...actionCreators: any) {
  const stateFnc = (state: any) => ({
    ...state,
    loading: calculateLoading(state),
    error: undefined as HttpError,
  });
  return on<S, any>(...actionCreators, stateFnc);
}

export function setErrorOn<S = any>(...actionCreators: any) {
  const stateFnc = (state: any, action: { payload: { error: HttpError }; type: string }) => ({
    ...state,
    error: action.payload.error,
    loading: calculateLoading(state),
  });
  return on<S, any>(...actionCreators, stateFnc);
}

/**
 * @example const [ loadData, loadDataSuccess, loadDataError ] = createHTTPActions<Parameters, ResponseData, ResponseError>('[Some Component] Load Data');
 * @param actionType
 */
export function createHTTPActions<RequestPayload = void, ResponsePayload = void, ErrorPayload = HttpError>(
  actionType: string
): [
  ActionCreator<string, (props?: RequestPayload) => { requestPayload: RequestPayload } & TypedAction<string>>,
  ActionCreator<string, (props?: ResponsePayload) => { responsePayload: ResponsePayload } & TypedAction<string>>,
  ActionCreator<string, (props?: ErrorPayload) => { errorPayload: ErrorPayload } & TypedAction<string>>
] {
  return [
    createAction(actionType, (requestPayload: RequestPayload) => ({ requestPayload })),
    createAction(`${actionType} Success`, (responsePayload?: ResponsePayload) => ({ responsePayload })),
    createAction(`${actionType} Error`, (errorPayload: ErrorPayload) => ({ errorPayload })),
  ];
}
