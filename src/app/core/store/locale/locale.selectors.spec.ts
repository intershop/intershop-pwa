import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Locale } from '../../../models/locale/locale.model';
import { LogEffects } from '../../../utils/dev/log.effects';
import { coreReducers } from '../core.system';
import { SelectLocale, SetAvailableLocales } from './locale.actions';
import { getAvailableLocales, getCurrentLocale } from './locale.selectors';

describe('Locale Selectors', () => {
  let store$: LogEffects;

  const locales = [{ lang: 'cn' }, { lang: 'jp' }] as Locale[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers), EffectsModule.forRoot([LogEffects])],
    });

    store$ = TestBed.get(LogEffects);
  });

  it('should have nothing when just initialized', () => {
    expect(getCurrentLocale(store$.state)).toBeUndefined();
    expect(getAvailableLocales(store$.state)).toBeEmpty();
  });

  it('should select a available locales when SetAvailableLocales action is reduced', () => {
    store$.dispatch(new SetAvailableLocales(locales));

    expect(getCurrentLocale(store$.state)).toBeUndefined();
    expect(getAvailableLocales(store$.state)).toEqual(locales);
  });

  it('should select a locale when SelectLocale action is reduced', () => {
    store$.dispatch(new SetAvailableLocales(locales));
    store$.dispatch(new SelectLocale(locales[1]));

    expect(getCurrentLocale(store$.state)).toEqual(locales[1]);
    expect(getAvailableLocales(store$.state)).toEqual(locales);
  });
});
