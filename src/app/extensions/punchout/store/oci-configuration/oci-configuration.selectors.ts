import { createSelector } from '@ngrx/store';

import { getPunchoutState } from '../punchout-store';

const getOciConfigurationState = createSelector(getPunchoutState, state => state.ociConfiguration);

export const getOciConfiguration = createSelector(getOciConfigurationState, state => state.config);

export const getOciConfigurationLoading = createSelector(getOciConfigurationState, state => state.loading);

export const getOciConfigurationError = createSelector(getOciConfigurationState, state => state.error);
