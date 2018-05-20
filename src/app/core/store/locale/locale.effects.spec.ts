import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cold, hot } from 'jasmine-marbles';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { Observable } from 'rxjs';
import { anything, capture, instance, mock, verify } from 'ts-mockito/lib/ts-mockito';
import { Locale } from '../../../models/locale/locale.model';
import { AVAILABLE_LOCALES } from '../../configurations/injection-keys';
import { coreReducers } from '../core.system';
import { SelectLocale, SetAvailableLocales } from './locale.actions';
import { LocaleEffects } from './locale.effects';

describe('Locale Effects', () => {
  let actions$: Observable<Action>;
  let effects: LocaleEffects;
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
  });

  describe('setLocale$', () => {
    it('should call TranslateService when SetLocale action is handled', () => {
      const action = new SelectLocale({ lang: 'jp' } as Locale);

      actions$ = hot('-a', { a: action });

      effects.setLocale$.subscribe(() => {
        verify(translateServiceMock.use(anything())).once();
        const params = capture(translateServiceMock.use).last();
        expect(params[0]).toEqual('jp');
      });
    });
  });

  describe('loadAllLocales$', () => {
    it('should load all locales on first routing action and only then', () => {
      const action = { type: ROUTER_NAVIGATION_TYPE } as Action;
      const expected = new SetAvailableLocales(defaultLocales);

      actions$ = hot('-a--a-----a', { a: action });

      expect(effects.loadAllLocales$).toBeObservable(cold('-(b|)-------------', { b: expected }));
    });
  });

  describe('setFirstAvailableLocale$', () => {
    it('should trigger loading the first available locale when SetAvailableLocales action was received', () => {
      const japanese = { lang: 'jp' } as Locale;
      const action = new SetAvailableLocales([japanese]);
      const expected = new SelectLocale(japanese);

      actions$ = hot('-a', { a: action });

      expect(effects.setFirstAvailableLocale$).toBeObservable(cold('-b', { b: expected }));
    });

    it('should trigger SelectLocale with null locale when SetAvailableLocales action was received with no locales', () => {
      const action = new SetAvailableLocales([]);
      const expected = new SelectLocale(null);

      actions$ = hot('-a', { a: action });

      expect(effects.setFirstAvailableLocale$).toBeObservable(cold('-b', { b: expected }));
    });
  });
});
