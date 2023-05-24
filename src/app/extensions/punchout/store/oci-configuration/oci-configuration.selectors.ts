import { createSelector } from '@ngrx/store';

import { getPunchoutState } from '../punchout-store';

const getOciConfigurationState = createSelector(getPunchoutState, state => state.ociConfiguration);

export const getOciConfiguration = createSelector(getOciConfigurationState, state => state.configuration);

export const getOciConfigurationLoading = createSelector(getOciConfigurationState, state => state.loading);

export const getOciConfigurationError = createSelector(getOciConfigurationState, state => state.error);

const getOciConfigurationOptions = createSelector(getOciConfigurationState, state => state.options);

export const getOciFormatters = createSelector(getOciConfigurationOptions, options => options?.availableFormatters);

export const getOciPlaceholders = createSelector(getOciConfigurationOptions, options => options?.availablePlaceholders);
