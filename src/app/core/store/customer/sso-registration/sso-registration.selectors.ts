import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

const getSsoRegistrationState = createSelector(getCustomerState, state => state.ssoRegistration);

export const getSsoRegistrationInfo = createSelector(getSsoRegistrationState, state => state.registrationInfo);

export const isSsoRegistrationSuccessfully = createSelector(getSsoRegistrationState, state => state.registered);
