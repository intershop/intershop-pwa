import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { cancelRegistration, registerFailure, registerSuccess } from './sso-registration.actions';

export interface SsoRegistrationState {
  registered: boolean;
  cancelled: boolean;
  error: HttpError;
}

const initialState: SsoRegistrationState = {
  registered: false,
  cancelled: false,
  error: undefined,
};

export const ssoRegistrationReducer = createReducer(
  initialState,
  on(registerSuccess, (state: SsoRegistrationState) => ({
    ...state,
    registered: true,
  })),
  on(registerFailure, (state: SsoRegistrationState, { payload: { error } }) => ({
    ...state,
    error,
  })),
  on(cancelRegistration, (state: SsoRegistrationState) => ({ ...state, cancelled: true }))
);
