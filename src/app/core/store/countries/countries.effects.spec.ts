import { TestBed } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';
import { Country } from '../../../models/country/country.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { CountryService } from '../../services/countries/country.service';
import { coreReducers } from '../core.system';
import { LoadCountriesFail, LoadCountriesSuccess } from './countries.actions';
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
      imports: [StoreModule.forRoot(coreReducers)],
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
      const action = { type: ROOT_EFFECTS_INIT } as Action;
      const expected = new LoadCountriesSuccess(countries);

      actions$ = hot('-a', { a: action });

      expect(effects.loadCountries$).toBeObservable(cold('-b', { b: expected }));
    });

    it('should dispatch a LoadCountriesFail action if a load error occurs', () => {
      when(countryServiceMock.getCountries()).thenReturn(throwError({ message: 'error' }));

      const action = { type: ROOT_EFFECTS_INIT } as Action;
      const expected = new LoadCountriesFail({ message: 'error' } as HttpError);

      actions$ = hot('-a-a', { a: action });

      expect(effects.loadCountries$).toBeObservable(cold('-b-b', { b: expected }));
    });
  });
});
