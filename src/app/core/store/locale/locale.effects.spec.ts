import { TestBed } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cold } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { SelectLocale, SetAvailableLocales } from './locale.actions';
import { LocaleEffects } from './locale.effects';

describe('Locale Effects', () => {
  let actions$: Observable<Action>;
  let effects: LocaleEffects;
  let store$: Store<{}>;
  let translateServiceMock: TranslateService;
  const defaultLocales = [
    { lang: 'en_US', value: 'en', displayName: 'English' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  beforeEach(() => {
    translateServiceMock = mock(TranslateService);

    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: coreReducers })],
      providers: [
        LocaleEffects,
        provideMockActions(() => actions$),
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        { provide: AVAILABLE_LOCALES, useValue: defaultLocales },
      ],
    });

    effects = TestBed.get(LocaleEffects);
    store$ = TestBed.get(Store);
  });

  describe('setLocale$', () => {
    it('should call TranslateService when locale was selected', done => {
      effects.setLocale$.subscribe(() => {
        verify(translateServiceMock.use(anything())).once();
        const params = capture(translateServiceMock.use).last();
        expect(params[0]).toEqual('en_US');
        done();
      });

      store$.dispatch(new SetAvailableLocales({ locales: defaultLocales }));
      store$.dispatch(new SelectLocale({ lang: 'en_US' }));
    });
  });

  describe('loadAllLocales$', () => {
    it('should load all locales on effects init', () => {
      const expected = new SetAvailableLocales({ locales: defaultLocales });
      actions$ = of({ type: ROOT_EFFECTS_INIT });
      expect(effects.loadAllLocales$).toBeObservable(cold('(b|)', { b: expected }));
    });
  });
});
