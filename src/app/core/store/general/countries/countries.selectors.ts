import { createSelector } from '@ngrx/store';

import { getGeneralState } from 'ish-core/store/general/general-store';

import { countryAdapter } from './countries.reducer';

const getCountriesState = createSelector(getGeneralState, state => state.countries);

export const { selectAll: getAllCountries } = countryAdapter.getSelectors(getCountriesState);
