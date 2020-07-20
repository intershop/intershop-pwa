import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash-es';

import { TactonSavedConfiguration } from '../../models/tacton-saved-configuration/tacton-saved-configuration.model';

import { saveTactonConfigurationReference } from './saved-tacton-configuration.actions';

export interface SavedTactonConfigurationState extends EntityState<TactonSavedConfiguration> {}

export const tactonSavedConfigurationAdapter = createEntityAdapter<TactonSavedConfiguration>();

const initialState: SavedTactonConfigurationState = tactonSavedConfigurationAdapter.getInitialState({});

export const savedTactonConfigurationReducer = createReducer(
  initialState,
  on(saveTactonConfigurationReference, (state, action) =>
    tactonSavedConfigurationAdapter.upsertOne(
      {
        id: action.payload.tactonProduct,
        ...pick(action.payload.configuration, 'configId', 'configState', 'externalId'),
      },
      state
    )
  )
);
