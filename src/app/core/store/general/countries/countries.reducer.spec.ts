import { Country } from 'ish-core/models/country/country.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadCountries, loadCountriesFail, loadCountriesSuccess } from './countries.actions';
import { countriesReducer, initialState } from './countries.reducer';

describe('Countries Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<typeof loadCountries | typeof loadCountriesFail | typeof loadCountriesSuccess>;
      const state = countriesReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadCountries actions', () => {
    describe('LoadCountry action', () => {
      it('should set loading to true', () => {
        const action = loadCountries();
        const state = countriesReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadCountriesFail action', () => {
      it('should set loading to false', () => {
        const action = loadCountriesFail({ error: makeHttpError({}) });
        const state = countriesReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadCountriesSuccess action', () => {
      let country: Country;

      beforeEach(() => {
        country = {
          countryCode: 'BG',
          name: 'Bulgaria',
        } as Country;
      });

      it('should insert countries if not exist', () => {
        const action = loadCountriesSuccess({ countries: [country] });
        const state = countriesReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[country.countryCode]).toEqual(country);
      });
    });
  });
});
