import { createSelector } from '@ngrx/store';
import { State } from '../core.state';
import { getAuthorized, getCustomer, getError } from './user.reducer';

const getUserState = (state: State) => state.user;

export const getLoggedInUser = createSelector(getUserState, getCustomer);
export const getUserAuthorized = createSelector(getUserState, getAuthorized);
export const getLoginError = createSelector(getUserState, getError);
