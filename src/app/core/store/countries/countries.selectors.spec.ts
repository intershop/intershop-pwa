import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Country } from '../../../models/country/country.model';
import { c } from '../../../utils/dev/marbles-utils';
import { CoreState } from '../core.state';
import { coreReducers } from '../core.system';
import { LoadCountries, LoadCountriesFail, LoadCountriesSuccess } from './countries.actions';
import { getAllCountries, getCountriesLoading } from './countries.selectors';

describe('Countries Selectors', () => {

  let store$: Store<CoreState>;

  let countries$: Observable<Country[]>;
  let countriesLoading$: Observable<boolean>;

  const countries = [
    { countryCode: 'BG', name: 'Bulgaria' },
    { countryCode: 'DE', name: 'Germany' }
  ] as Country[];

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(coreReducers)
      ]
    });

    store$ = TestBed.get(Store);

    countries$ = store$.pipe(select(getAllCountries));
    countriesLoading$ = store$.pipe(select(getCountriesLoading));
  });

  describe('with empty state', () => {

    it('should not select any countries when used', () => {
      expect(countries$).toBeObservable(c([]));
      expect(countriesLoading$).toBeObservable(c(false));
    });
  });

  describe('loading countries', () => {

    beforeEach(() => {
      store$.dispatch(new LoadCountries());
    });

    it('should set the state to loading', () => {
      expect(countriesLoading$).toBeObservable(c(true));
    });

    describe('and reporting success', () => {

      beforeEach(() => {
        store$.dispatch(new LoadCountriesSuccess(countries));
      });

      it('should set loading to false', () => {
        expect(countriesLoading$).toBeObservable(c(false));
        expect(countries$).toBeObservable(c(countries));
      });
    });

    describe('and reporting failure', () => {

      beforeEach(() => {
        store$.dispatch(new LoadCountriesFail({ message: 'error' } as HttpErrorResponse));
      });

      it('should not have loaded category on error', () => {
        expect(countriesLoading$).toBeObservable(c(false));
        expect(countries$).toBeObservable(c([]));
      });
    });
  });
});
