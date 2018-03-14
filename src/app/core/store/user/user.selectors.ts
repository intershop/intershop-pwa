import { createSelector } from '@ngrx/store';
import { CoreState } from '../core.state';
import { getAuthorized, getCustomer, getError } from './user.reducer';

const getUserState = (state: CoreState) => state.user;

export const getLoggedInUser = createSelector(getUserState, getCustomer);
export const getUserAuthorized = createSelector(getUserState, getAuthorized);
export const getUserError = createSelector(getUserState, getError);
