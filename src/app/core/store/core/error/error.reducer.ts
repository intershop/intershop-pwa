import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { businessError, communicationTimeoutError, serverConfigError, serverError } from './error.actions';

export interface ErrorState {
  current: HttpError | string;
  type: string;
}

const initialState: ErrorState = {
  current: undefined,
  type: undefined,
};

export const errorReducer = createReducer(
  initialState,
  on(
    serverError,
    businessError,
    communicationTimeoutError,
    serverConfigError,
    (state, action): ErrorState => ({
      ...state,
      current: action.payload.error,
      type: action.type,
    })
  )
);
