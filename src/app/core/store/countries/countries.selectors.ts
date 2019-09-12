import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';

import { countryAdapter } from './countries.reducer';

const getCountriesState = createSelector(
  getCoreState,
  state => state.countries
);

export const { selectEntities: getCountryEntities, selectAll: getAllCountries } = countryAdapter.getSelectors(
  getCountriesState
);

export const getCountriesLoading = createSelector(
  getCountriesState,
  countries => countries.loading
);
