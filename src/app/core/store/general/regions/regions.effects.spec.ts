import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Region } from 'ish-core/models/region/region.model';
import { CountryService } from 'ish-core/services/country/country.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';

import { LoadRegions, LoadRegionsFail, LoadRegionsSuccess } from './regions.actions';
import { RegionsEffects } from './regions.effects';

describe('Regions Effects', () => {
  let actions$: Observable<Action>;
  let effects: RegionsEffects;
  let countryServiceMock: CountryService;

  const countryCode = 'US';

  const regions = [
    { name: 'Iowa', regionCode: 'Io', countryCode, id: 'Io' + countryCode },
    { name: 'Alabama', regionCode: 'Al', countryCode: 'US', id: 'Al' + countryCode },
  ] as Region[];

  beforeEach(() => {
    countryServiceMock = mock(CountryService);
    when(countryServiceMock.getRegionsByCountry(anyString())).thenReturn(of(regions));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('regions')],
      providers: [
        RegionsEffects,
        provideMockActions(() => actions$),
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
      ],
    });

    effects = TestBed.inject(RegionsEffects);
  });

  describe('loadRegions$', () => {
    it('should call the countryService for loadRegions', done => {
      const action = new LoadRegions({ countryCode });
      actions$ = of(action);

      effects.loadRegions$.subscribe(() => {
        verify(countryServiceMock.getRegionsByCountry(anyString())).once();
        done();
      });
    });
    it('should map to action of type LoadRegionSuccess', () => {
      const action = new LoadRegions({ countryCode });
      const completion = new LoadRegionsSuccess({ regions });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadRegions$).toBeObservable(expected$);
    });
    it('should map invalid request to action of type LoadRegionsFail', () => {
      when(countryServiceMock.getRegionsByCountry(anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new LoadRegions({ countryCode });
      const error = { message: 'invalid' } as HttpError;
      const completion = new LoadRegionsFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadRegions$).toBeObservable(expected$);
    });
  });
});
