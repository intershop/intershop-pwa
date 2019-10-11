import { TestBed } from '@angular/core/testing';

import { Country } from 'ish-core/models/country/country.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { LoadCountries, LoadCountriesFail, LoadCountriesSuccess } from './countries.actions';
import { getAllCountries, getCountriesLoading } from './countries.selectors';

describe('Countries Selectors', () => {
  let store$: TestStore;

  const countries = [{ countryCode: 'BG', name: 'Bulgaria' }, { countryCode: 'DE', name: 'Germany' }] as Country[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({ reducers: coreReducers }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any countries when used', () => {
      expect(getAllCountries(store$.state)).toBeEmpty();
      expect(getCountriesLoading(store$.state)).toBeFalse();
    });
  });

  describe('loading countries', () => {
    beforeEach(() => {
      store$.dispatch(new LoadCountries());
    });

    it('should set the state to loading', () => {
      expect(getCountriesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadCountriesSuccess({ countries }));
      });

      it('should set loading to false', () => {
        expect(getCountriesLoading(store$.state)).toBeFalse();
        expect(getAllCountries(store$.state)).toEqual(countries);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadCountriesFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded category on error', () => {
        expect(getCountriesLoading(store$.state)).toBeFalse();
        expect(getAllCountries(store$.state)).toBeEmpty();
      });
    });
  });
});
