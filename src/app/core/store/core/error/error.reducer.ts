import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { communicationTimeoutError, generalError, serverError } from './error.actions';

export interface ErrorState {
  current: HttpError;
  type: string;
}

export const initialState: ErrorState = {
  current: undefined,
  type: undefined,
};

export const errorReducer = createReducer(
  initialState,
  on(generalError, serverError, communicationTimeoutError, (state: ErrorState, action) => ({
    ...state,
    current: action.payload.error,
    type: action.type,
  }))
);
