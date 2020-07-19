import { TestBed } from '@angular/core/testing';

import { Country } from 'ish-core/models/country/country.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadCountries, loadCountriesFail, loadCountriesSuccess } from './countries.actions';
import { getAllCountries, getCountriesLoading } from './countries.selectors';

describe('Countries Selectors', () => {
  let store$: StoreWithSnapshots;

  const countries = [
    { countryCode: 'BG', name: 'Bulgaria' },
    { countryCode: 'DE', name: 'Germany' },
  ] as Country[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('countries')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any countries when used', () => {
      expect(getAllCountries(store$.state)).toBeEmpty();
      expect(getCountriesLoading(store$.state)).toBeFalse();
    });
  });

  describe('loading countries', () => {
    beforeEach(() => {
      store$.dispatch(loadCountries());
    });

    it('should set the state to loading', () => {
      expect(getCountriesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadCountriesSuccess({ countries }));
      });

      it('should set loading to false', () => {
        expect(getCountriesLoading(store$.state)).toBeFalse();
        expect(getAllCountries(store$.state)).toEqual(countries);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadCountriesFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have loaded category on error', () => {
        expect(getCountriesLoading(store$.state)).toBeFalse();
        expect(getAllCountries(store$.state)).toBeEmpty();
      });
    });
  });
});
