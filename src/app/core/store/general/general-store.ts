import { createFeatureSelector } from '@ngrx/store';

import { CountriesState } from './countries/countries.reducer';
import { RegionsState } from './regions/regions.reducer';

export interface GeneralState {
  countries: CountriesState;
  regions: RegionsState;
}

export const getGeneralState = createFeatureSelector<GeneralState>('general');
