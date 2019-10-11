import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { Country } from 'ish-core/models/country/country.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CountryService } from 'ish-core/services/country/country.service';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CountryActionTypes, LoadCountriesFail, LoadCountriesSuccess } from './countries.actions';
import { CountriesEffects } from './countries.effects';

describe('Countries Effects', () => {
  let actions$: Observable<Action>;
  let effects: CountriesEffects;
  let countryServiceMock: CountryService;

  const countries = [{ countryCode: 'BG', name: 'Bulgaria' }, { countryCode: 'DE', name: 'Germany' }] as Country[];

  beforeEach(() => {
    countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(of(countries));

    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: coreReducers })],
      providers: [
        CountriesEffects,
        provideMockActions(() => actions$),
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
      ],
    });

    effects = TestBed.get(CountriesEffects);
  });

  describe('loadCountries$', () => {
    it('should load all countries on effects init and dispatch a LoadCountriesSuccess action', () => {
      const action = { type: CountryActionTypes.LoadCountries } as Action;
      const expected = new LoadCountriesSuccess({ countries });

      actions$ = hot('-a-------', { a: action });

      expect(effects.loadCountries$).toBeObservable(cold('-b-------', { b: expected }));
    });

    it('should dispatch a LoadCountriesFail action if a load error occurs', () => {
      when(countryServiceMock.getCountries()).thenReturn(throwError({ message: 'error' }));

      const action = { type: CountryActionTypes.LoadCountries } as Action;
      const expected = new LoadCountriesFail({ error: { message: 'error' } as HttpError });

      actions$ = hot('-a', { a: action });

      expect(effects.loadCountries$).toBeObservable(cold('-b', { b: expected }));
    });
  });
});
