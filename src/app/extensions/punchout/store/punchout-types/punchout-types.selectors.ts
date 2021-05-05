import { createSelector } from '@ngrx/store';

import { getPunchoutState } from '../punchout-store';

const getPunchoutTypesState = createSelector(getPunchoutState, state => state.punchoutTypes);

export const getPunchoutTypes = createSelector(getPunchoutTypesState, state => state.types);

export const getPunchoutTypesLoading = createSelector(getPunchoutTypesState, state => state.loading);

export const getPunchoutTypesError = createSelector(getPunchoutTypesState, state => state.error);
