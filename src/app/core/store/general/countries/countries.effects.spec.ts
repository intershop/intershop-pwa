import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { Country } from 'ish-core/models/country/country.model';
import { CountryService } from 'ish-core/services/country/country.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadCountries, loadCountriesFail, loadCountriesSuccess } from './countries.actions';
import { CountriesEffects } from './countries.effects';

describe('Countries Effects', () => {
  let actions$: Observable<Action>;
  let effects: CountriesEffects;
  let countryServiceMock: CountryService;

  const countries = [
    { countryCode: 'BG', name: 'Bulgaria' },
    { countryCode: 'DE', name: 'Germany' },
  ] as Country[];

  beforeEach(() => {
    countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(of(countries));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('countries')],
      providers: [
        CountriesEffects,
        provideMockActions(() => actions$),
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
      ],
    });

    effects = TestBed.inject(CountriesEffects);
  });

  describe('loadCountries$', () => {
    it('should load all countries on effects init and dispatch a LoadCountriesSuccess action', () => {
      const action = { type: loadCountries.type } as Action;
      const expected = loadCountriesSuccess({ countries });

      actions$ = hot('-a-------', { a: action });

      expect(effects.loadCountries$).toBeObservable(cold('-b-------', { b: expected }));
    });

    it('should dispatch a LoadCountriesFail action if a load error occurs', () => {
      when(countryServiceMock.getCountries()).thenReturn(throwError(makeHttpError({ message: 'error' })));

      const action = { type: loadCountries.type } as Action;
      const expected = loadCountriesFail({ error: makeHttpError({ message: 'error' }) });

      actions$ = hot('-a', { a: action });

      expect(effects.loadCountries$).toBeObservable(cold('-b', { b: expected }));
    });
  });
});
