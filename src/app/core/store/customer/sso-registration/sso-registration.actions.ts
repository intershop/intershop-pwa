import { createAction } from '@ngrx/store';

import { CustomerRegistrationType, SsoRegistrationType } from 'ish-core/models/customer/customer.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const setRegistrationInfo = createAction(
  '[SsoRegistration] Set Registration Info',
  payload<SsoRegistrationType>()
);

export const registerSuccess = createAction(
  '[SsoRegistration] Register SMB Customer Success',
  payload<CustomerRegistrationType>()
);

export const registerFailure = createAction('[SsoRegistration] Register SMB Customer Failure', httpError());

export const cancelRegistration = createAction('[SsoRegistration] Cancel Registration');
