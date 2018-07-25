import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Country } from '../../../models/country/country.model';
import { LogEffects } from '../../../utils/dev/log.effects';
import { coreReducers } from '../core.system';
import { LoadCountries, LoadCountriesFail, LoadCountriesSuccess } from './countries.actions';
import { getAllCountries, getCountriesLoading } from './countries.selectors';

describe('Countries Selectors', () => {
  let store$: LogEffects;

  const countries = [{ countryCode: 'BG', name: 'Bulgaria' }, { countryCode: 'DE', name: 'Germany' }] as Country[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers), EffectsModule.forRoot([LogEffects])],
    });

    store$ = TestBed.get(LogEffects);
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
        store$.dispatch(new LoadCountriesSuccess(countries));
      });

      it('should set loading to false', () => {
        expect(getCountriesLoading(store$.state)).toBeFalse();
        expect(getAllCountries(store$.state)).toEqual(countries);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadCountriesFail({ message: 'error' } as HttpErrorResponse));
      });

      it('should not have loaded category on error', () => {
        expect(getCountriesLoading(store$.state)).toBeFalse();
        expect(getAllCountries(store$.state)).toBeEmpty();
      });
    });
  });
});
