import { HttpErrorResponse } from '@angular/common/http';
import { Country } from '../../../models/country/country.model';
import { CountryAction, LoadCountries, LoadCountriesFail, LoadCountriesSuccess } from './countries.actions';
import { countriesReducer, initialState } from './countries.reducer';

describe('Countries Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as CountryAction;
      const state = countriesReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadCountries actions', () => {
    describe('LoadCountry action', () => {
      it('should set loading to true', () => {
        const action = new LoadCountries();
        const state = countriesReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadCountriesFail action', () => {
      it('should set loading to false', () => {
        const action = new LoadCountriesFail({} as HttpErrorResponse);
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
        const action = new LoadCountriesSuccess([country]);
        const state = countriesReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[country.countryCode]).toEqual(country);
      });
    });
  });
});
