import { createSelector } from '@ngrx/store';

import { getPunchoutState } from '../punchout-store';

import { ociPunchoutAdapter } from './oci-punchout.reducer';

const getOciPunchoutState = createSelector(getPunchoutState, state => state.ociPunchout);

export const getPunchoutLoading = createSelector(getOciPunchoutState, state => state.loading);

export const getPunchoutError = createSelector(getOciPunchoutState, state => state.error);

const { selectAll } = ociPunchoutAdapter.getSelectors(getOciPunchoutState);

export const getPunchoutUsers = selectAll;
