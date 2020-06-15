import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ErrorActionTypes, HttpErrorAction } from './error.actions';

export interface ErrorState {
  current: HttpError;
  type: string;
}

export const initialState: ErrorState = {
  current: undefined,
  type: undefined,
};

export function errorReducer(state = initialState, action: HttpErrorAction): ErrorState {
  switch (action.type) {
    case ErrorActionTypes.GeneralError:
    case ErrorActionTypes.ServerError:
    case ErrorActionTypes.CommunicationTimeoutError: {
      return { ...state, current: action.payload.error, type: action.type };
    }
  }
  return state;
}
