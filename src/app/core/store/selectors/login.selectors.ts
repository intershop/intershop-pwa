import { createSelector } from '@ngrx/store';
import { State } from '../reducers';
import { getAuthorized, getCustomer } from '../reducers/login.reducer';

export const getLoginState = (state: State) => state.login;

export const getLoggedInUser = createSelector(getLoginState, getCustomer);

export const getUserAuthorized = createSelector(getLoginState, getAuthorized);
