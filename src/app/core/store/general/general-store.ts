import { createFeatureSelector } from '@ngrx/store';

import { ContactState } from './contact/contact.reducer';
import { CountriesState } from './countries/countries.reducer';
import { RegionsState } from './regions/regions.reducer';
import { ServerConfigState } from './server-config/server-config.reducer';

export interface GeneralState {
  countries: CountriesState;
  regions: RegionsState;
  contact: ContactState;
  serverConfig: ServerConfigState;
}

export const getGeneralState = createFeatureSelector<GeneralState>('general');
