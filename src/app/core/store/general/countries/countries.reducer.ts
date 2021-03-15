import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Country } from 'ish-core/models/country/country.model';

import { loadCountriesFail, loadCountriesSuccess } from './countries.actions';

export const countryAdapter = createEntityAdapter<Country>({
  selectId: country => country.countryCode,
});

export interface CountriesState extends EntityState<Country> {}

const initialState: CountriesState = countryAdapter.getInitialState({});

export const countriesReducer = createReducer(
  initialState,
  on(loadCountriesFail, state => ({
    ...state,
  })),
  on(loadCountriesSuccess, (state, action) => {
    const { countries } = action.payload;

    return countryAdapter.setAll(countries, state);
  })
);
