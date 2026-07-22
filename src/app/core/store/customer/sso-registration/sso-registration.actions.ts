import { createAction } from '@ngrx/store';

import { SsoRegistrationType } from 'ish-core/models/customer/customer.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const setRegistrationInfo = createAction(
  '[SSO Registration] Set Registration Info',
  payload<SsoRegistrationType>()
);

export const registerSuccess = createAction('[SSO Registration API] Register Customer Success');

export const registerFailure = createAction('[SSO Registration API] Register Customer Failure', httpError());

export const cancelRegistration = createAction('[SSO Registration] Cancel Registration');
