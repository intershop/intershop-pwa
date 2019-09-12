import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable } from 'rxjs';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';
import { coreReducers } from 'ish-core/store/core-store.module';

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
      imports: [StoreModule.forRoot(coreReducers)],
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
    it('should load all locales on first routing action', () => {
      const action = new RouteNavigation({ path: 'any' });
      const expected = new SetAvailableLocales({ locales: defaultLocales });

      actions$ = hot('-a--a-----a', { a: action });

      expect(effects.loadAllLocales$).toBeObservable(cold('-b----------------', { b: expected }));
    });
  });
});
