import { createReducer, on } from '@ngrx/store';

import { SsoRegistrationType } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { registerFailure, registerSuccess } from './sso-registration.actions';

export interface SsoRegistrationState {
  registered: boolean;
  error: HttpError;
  registrationInfo: SsoRegistrationType;
}

const initialState: SsoRegistrationState = {
  registered: false,
  error: undefined,
  registrationInfo: undefined,
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
  }))
);
