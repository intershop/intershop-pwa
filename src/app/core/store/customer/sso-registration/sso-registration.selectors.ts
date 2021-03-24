import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

const getSsoRegistrationState = createSelector(getCustomerState, state => state.ssoRegistration);

export const getSsoRegistrationError = createSelector(getSsoRegistrationState, state => state.error);

export const getSsoRegistrationRegistered = createSelector(getSsoRegistrationState, state => state.registered);

export const getSsoRegistrationCancelled = createSelector(getSsoRegistrationState, state => state.cancelled);
