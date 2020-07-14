import { createFeatureSelector } from '@ngrx/store';

import { TactonConfig } from '../models/tacton-config/tacton-config.model';

import { ProductConfigurationState } from './product-configuration/product-configuration.reducer';

export interface TactonState {
  productConfiguration: ProductConfigurationState;
  tactonConfig: TactonConfig;
}

export const getTactonState = createFeatureSelector<TactonState>('tacton');
