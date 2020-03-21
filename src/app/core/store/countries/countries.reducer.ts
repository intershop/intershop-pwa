import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Country } from 'ish-core/models/country/country.model';

import { CountryAction, CountryActionTypes } from './countries.actions';

export const countryAdapter = createEntityAdapter<Country>({
  selectId: country => country.countryCode,
});

export interface CountriesState extends EntityState<Country> {
  loading: boolean;
}

export const initialState: CountriesState = countryAdapter.getInitialState({
  loading: false,
});

export function countriesReducer(state = initialState, action: CountryAction): CountriesState {
  switch (action.type) {
    case CountryActionTypes.LoadCountries: {
      return {
        ...state,
        loading: true,
      };
    }

    case CountryActionTypes.LoadCountriesFail: {
      return {
        ...state,
        loading: false,
      };
    }

    case CountryActionTypes.LoadCountriesSuccess: {
      const { countries } = action.payload;

      return {
        ...countryAdapter.setAll(countries, state),
        loading: false,
      };
    }
  }

  return state;
}
