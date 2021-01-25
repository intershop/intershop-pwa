import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';

import { getPunchoutState } from '../punchout-store';

import { initialState, ociPunchoutAdapter } from './oci-punchout.reducer';

const getOciPunchoutState = createSelector(getPunchoutState, state => (state ? state.ociPunchout : initialState));

export const getPunchoutLoading = createSelector(getOciPunchoutState, state => state.loading);

export const getPunchoutError = createSelector(getOciPunchoutState, state => state.error);

const { selectAll, selectEntities } = ociPunchoutAdapter.getSelectors(getOciPunchoutState);

export const getPunchoutUsers = selectAll;

export const getSelectedPunchoutUser = createSelector(
  selectRouteParam('PunchoutLogin'),
  selectEntities,
  (login, users) => users[login]
);
