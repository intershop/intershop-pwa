import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';

const getUserState = createSelector(
  getCoreState,
  state => state.user
);

export const getLoggedInCustomer = createSelector(
  getUserState,
  state => state.customer
);

export const isBusinessCustomer = createSelector(
  getLoggedInCustomer,
  customer => !!customer && customer.isBusinessCustomer
);

export const getLoggedInUser = createSelector(
  getUserState,
  state => state.user
);
export const getUserAuthorized = createSelector(
  getUserState,
  state => state.authorized
);
export const getUserPaymentMethods = createSelector(
  getUserState,
  state => state.paymentMethods
);
export const getUserLoading = createSelector(
  getUserState,
  state => state.loading
);
export const getUserSuccessMessage = createSelector(
  getUserState,
  state => state.successMessage
);
export const getUserError = createSelector(
  getUserState,
  state => state.error
);
export const getAPIToken = createSelector(
  getUserState,
  state => state._authToken
);
export const getLastAPITokenBeforeLogin = createSelector(
  getUserState,
  state => state._lastAuthTokenBeforeLogin
);
export const getPGID = createSelector(
  getUserState,
  state => state.pgid
);

export const getPasswordReminderSuccess = createSelector(
  getUserState,
  state => state.passwordReminderSuccess
);
export const getPasswordReminderError = createSelector(
  getUserState,
  state => state.passwordReminderError
);
