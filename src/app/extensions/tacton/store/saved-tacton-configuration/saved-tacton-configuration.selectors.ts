import { createSelector } from '@ngrx/store';

import { getLoggedInUser } from 'ish-core/store/customer/user';

import { getTactonState } from '../tacton-store';

import {
  makeTactonSavedConfigurationReference,
  tactonSavedConfigurationAdapter,
} from './saved-tacton-configuration.reducer';

const getSavedTactonConfigurationState = createSelector(getTactonState, state => state._savedTactonConfiguration);

const { selectEntities } = tactonSavedConfigurationAdapter.getSelectors(getSavedTactonConfigurationState);

export const getSavedTactonConfiguration = (id: string) =>
  createSelector(
    selectEntities,
    getLoggedInUser,
    (entities, user) => entities[makeTactonSavedConfigurationReference(user?.login, id)]
  );
