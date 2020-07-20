import { createSelector } from '@ngrx/store';

import { getTactonState } from '../tacton-store';

import { tactonSavedConfigurationAdapter } from './saved-tacton-configuration.reducer';

const getSavedTactonConfigurationState = createSelector(getTactonState, state => state._savedTactonConfiguration);

export const { selectEntities: getSavedTactonConfigurationEntities } = tactonSavedConfigurationAdapter.getSelectors(
  getSavedTactonConfigurationState
);
