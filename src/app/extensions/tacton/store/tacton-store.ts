import { createFeatureSelector } from '@ngrx/store';

import { TactonConfig } from '../models/tacton-config/tacton-config.model';

import { ProductConfigurationState } from './product-configuration/product-configuration.reducer';
import { SavedTactonConfigurationState } from './saved-tacton-configuration/saved-tacton-configuration.reducer';

export interface TactonState {
  productConfiguration: ProductConfigurationState;
  tactonConfig: TactonConfig;
  _savedTactonConfiguration: SavedTactonConfigurationState;
}

export const getTactonState = createFeatureSelector<TactonState>('tacton');
