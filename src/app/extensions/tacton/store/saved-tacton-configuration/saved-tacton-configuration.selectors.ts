import { createSelector } from '@ngrx/store';

import { getTactonState } from '../tacton-store';

import { tactonSavedConfigurationAdapter } from './saved-tacton-configuration.reducer';

const getSavedTactonConfigurationState = createSelector(getTactonState, state => state._savedTactonConfiguration);

const { selectEntities } = tactonSavedConfigurationAdapter.getSelectors(getSavedTactonConfigurationState);

export const getSavedTactonConfiguration = (id: string) => createSelector(selectEntities, entities => entities[id]);
