import { TestBed } from '@angular/core/testing';
import { Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cold, hot } from 'jasmine-marbles';
import { anything, capture, instance, mock, verify } from 'ts-mockito/lib/ts-mockito';
import { SelectLocale, SetAvailableLocales } from '.';
import { TestActions, testActionsFactory } from '../../../dev-utils/test.actions';
import { Locale } from '../../../models/locale/locale.interface';
import { AVAILABLE_LOCALES } from '../../configurations/injection-keys';
import { reducers } from '../core.system';
import { LocaleEffects } from './locale.effects';

describe('LocaleEffects', () => {
  let actions$: TestActions;
  let effects: LocaleEffects;
  let translateServiceMock: TranslateService;
  let defaultLocales: Locale[];

  beforeEach(() => {
    translateServiceMock = mock(TranslateService);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
      ],
      providers: [
        LocaleEffects,
        { provide: Actions, useFactory: testActionsFactory },
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) }
      ],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(LocaleEffects);
    defaultLocales = TestBed.get(AVAILABLE_LOCALES);
  });

  describe('setLocale$', () => {
    it('should call TranslateService when SetLocale action is handled', () => {
      const action = new SelectLocale({ lang: 'jp' } as Locale);

      actions$.stream = hot('-a', { a: action });

      expect(effects.setLocale$).toBeObservable(cold('-'));
      verify(translateServiceMock.setDefaultLang(anything())).once();
      const params = capture(translateServiceMock.setDefaultLang).last();
      expect(params[0]).toEqual('jp');
    });
  });

  describe('loadAllLocales$', () => {
    it('should load all locales on effects init', () => {
      const action = { type: ROOT_EFFECTS_INIT } as Action;
      const expected = new SetAvailableLocales(defaultLocales);

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadAllLocales$).toBeObservable(cold('-b', { b: expected }));
    });
  });

  describe('setFirstAvailableLocale$', () => {
    it('should trigger loading the first available locale when SetAvailableLocales action was received', () => {
      const japanese = { lang: 'jp' } as Locale;
      const action = new SetAvailableLocales([japanese]);
      const expected = new SelectLocale(japanese);

      actions$.stream = hot('-a', { a: action });

      expect(effects.setFirstAvailableLocale$).toBeObservable(cold('-b', { b: expected }));
    });

    it('should trigger SelectLocale with null locale when SetAvailableLocales action was received with no locales', () => {
      const action = new SetAvailableLocales([]);
      const expected = new SelectLocale(null);

      actions$.stream = hot('-a', { a: action });

      expect(effects.setFirstAvailableLocale$).toBeObservable(cold('-b', { b: expected }));
    });
  });
});
