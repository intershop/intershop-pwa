import { createReducer, on } from '@ngrx/store';

import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';

import {
  changeTactonConfigurationStep,
  commitTactonConfigurationValue,
  setCurrentConfiguration,
  startConfigureTactonProduct,
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
    commitTactonConfigurationValue,
    uncommitTactonConfigurationValue,
    changeTactonConfigurationStep
  ),
  on(setCurrentConfiguration, (state, action) => ({
    ...state,
    loading: false,
    current: action.payload.configuration,
  }))
);
