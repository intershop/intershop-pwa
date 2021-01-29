import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';

import { getPunchoutState } from '../punchout-store';

import { initialState, punchoutUsersAdapter } from './punchout-users.reducer';

const getPunchoutUsersState = createSelector(getPunchoutState, state => (state ? state.punchoutUsers : initialState));

export const getPunchoutLoading = createSelector(getPunchoutUsersState, state => state.loading);

export const getPunchoutError = createSelector(getPunchoutUsersState, state => state.error);

const { selectAll, selectEntities } = punchoutUsersAdapter.getSelectors(getPunchoutUsersState);

export const getPunchoutUsers = selectAll;

export const getSelectedPunchoutUser = createSelector(
  selectRouteParam('PunchoutLogin'),
  selectEntities,
  (login, users) => users[login]
);
