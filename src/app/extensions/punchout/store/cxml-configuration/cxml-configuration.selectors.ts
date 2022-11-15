import { createSelector } from '@ngrx/store';

import { getPunchoutState } from '../punchout-store';

const getCxmlConfigurationState = createSelector(getPunchoutState, state => state.cxmlConfiguration);

export const getCxmlConfiguration = createSelector(getCxmlConfigurationState, state => state.configuration);

export const getCxmlConfigurationLoading = createSelector(getCxmlConfigurationState, state => state.loading);

export const getCxmlConfigurationError = createSelector(getCxmlConfigurationState, state => state.error);
