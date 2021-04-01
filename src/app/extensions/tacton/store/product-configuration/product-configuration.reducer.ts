import { createReducer, on } from '@ngrx/store';

import { setLoadingOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';

import {
  changeTactonConfigurationStep,
  clearTactonConfiguration,
  commitTactonConfigurationValue,
  continueConfigureTactonProduct,
  setCurrentConfiguration,
  startConfigureTactonProduct,
  submitTactonConfiguration,
  submitTactonConfigurationSuccess,
  uncommitTactonConfigurationValue,
} from './product-configuration.actions';

export interface ProductConfigurationState {
  loading: boolean;
  current: TactonProductConfiguration;
}

const initialState: ProductConfigurationState = {
  loading: false,
  current: undefined,
};

export const productConfigurationReducer = createReducer(
  initialState,
  setLoadingOn(
    startConfigureTactonProduct,
    continueConfigureTactonProduct,
    commitTactonConfigurationValue,
    uncommitTactonConfigurationValue,
    changeTactonConfigurationStep,
    submitTactonConfiguration
  ),
  unsetLoadingOn(setCurrentConfiguration),
  on(setCurrentConfiguration, (state, action) => ({
    ...state,
    current: action.payload.configuration,
  })),
  on(clearTactonConfiguration, submitTactonConfigurationSuccess, () => initialState)
);
