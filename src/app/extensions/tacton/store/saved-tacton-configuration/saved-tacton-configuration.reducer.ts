import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash-es';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonSavedConfiguration } from '../../models/tacton-saved-configuration/tacton-saved-configuration.model';
import { submitTactonConfigurationFail, submitTactonConfigurationSuccess } from '../product-configuration';

import { saveTactonConfigurationReference } from './saved-tacton-configuration.actions';

export interface SavedTactonConfigurationState extends EntityState<TactonSavedConfiguration> {}

export function makeTactonSavedConfigurationReference(user: string, productId: string): string {
  return `${user || 'anonymous'}:${productId}`;
}

export const tactonSavedConfigurationAdapter = createEntityAdapter<TactonSavedConfiguration>({
  selectId: e => makeTactonSavedConfigurationReference(e.user, e.productId),
});

const initialState: SavedTactonConfigurationState = tactonSavedConfigurationAdapter.getInitialState({});

function getActiveStep(config: TactonProductConfiguration): string {
  return config.steps.find(s => s.current).name;
}

export const savedTactonConfigurationReducer = createReducer(
  initialState,
  on(saveTactonConfigurationReference, (state, action) =>
    tactonSavedConfigurationAdapter.setOne(
      {
        productId: action.payload.tactonProduct,
        user: action.payload.user || 'anonymous',
        step: getActiveStep(action.payload.configuration),
        ...pick(action.payload.configuration, 'configId', 'configState', 'externalId'),
      },
      state
    )
  ),
  on(submitTactonConfigurationSuccess, submitTactonConfigurationFail, (state, action) =>
    tactonSavedConfigurationAdapter.removeOne(
      makeTactonSavedConfigurationReference(action.payload.user, action.payload.productId),
      state
    )
  )
);
