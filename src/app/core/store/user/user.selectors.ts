import { createSelector } from '@ngrx/store';

import { CoreState } from '../core.state';

import { getAuthToken, getAuthorized, getCustomer, getError, getUser } from './user.reducer';

const getUserState = (state: CoreState) => state.user;

export const getLoggedInCustomer = createSelector(getUserState, getCustomer);
export const getLoggedInUser = createSelector(getUserState, getUser);
export const getUserAuthorized = createSelector(getUserState, getAuthorized);
export const getUserError = createSelector(getUserState, getError);
export const getAPIToken = createSelector(getUserState, getAuthToken);
