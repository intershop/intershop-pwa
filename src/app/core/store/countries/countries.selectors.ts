import { createSelector } from '@ngrx/store';

import { CoreState } from '../core-store.module';

import { countryAdapter } from './countries.reducer';

const getCountriesState = (state: CoreState) => state.countries;

export const { selectEntities: getCountryEntities, selectAll: getAllCountries } = countryAdapter.getSelectors(
  getCountriesState
);

export const getCountriesLoading = createSelector(getCountriesState, countries => countries.loading);
