import { createFeatureSelector } from '@ngrx/store';

import { ContactState } from './contact/contact.reducer';
import { CountriesState } from './countries/countries.reducer';
import { RegionsState } from './regions/regions.reducer';

export interface GeneralState {
  countries: CountriesState;
  regions: RegionsState;
  contact: ContactState;
}

export const getGeneralState = createFeatureSelector<GeneralState>('general');
