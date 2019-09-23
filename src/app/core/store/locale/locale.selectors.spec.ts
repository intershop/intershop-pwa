import { TestBed } from '@angular/core/testing';

import { Locale } from 'ish-core/models/locale/locale.model';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { SelectLocale, SetAvailableLocales } from './locale.actions';
import { localeReducer } from './locale.reducer';
import { getAvailableLocales, getCurrentLocale } from './locale.selectors';

describe('Locale Selectors', () => {
  let store$: TestStore;

  const locales = [{ lang: 'cn' }, { lang: 'jp' }] as Locale[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({ reducers: { locale: localeReducer } }),
    });

    store$ = TestBed.get(TestStore);
  });

  it('should have nothing when just initialized', () => {
    expect(getCurrentLocale(store$.state)).toBeUndefined();
    expect(getAvailableLocales(store$.state)).toBeEmpty();
  });

  it('should select a available locales when SetAvailableLocales action is reduced', () => {
    store$.dispatch(new SetAvailableLocales({ locales }));

    expect(getCurrentLocale(store$.state)).toEqual(locales[0]);
    expect(getAvailableLocales(store$.state)).toEqual(locales);
  });

  it('should select a locale when SelectLocale action is reduced', () => {
    store$.dispatch(new SetAvailableLocales({ locales }));
    store$.dispatch(new SelectLocale({ lang: locales[1].lang }));

    expect(getCurrentLocale(store$.state)).toEqual(locales[1]);
    expect(getAvailableLocales(store$.state)).toEqual(locales);
  });
});
