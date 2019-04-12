import { createSelector } from '@ngrx/store';

import { getCoreState } from '../core-store';

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
export const getUserError = createSelector(
  getUserState,
  state => state.error
);
export const getAPIToken = createSelector(
  getUserState,
  state => state._authToken
);
