import { Locale } from 'ish-core/models/locale/locale.model';

import { LocaleAction, SelectLocale, SetAvailableLocales } from './locale.actions';
import { initialState, localeReducer } from './locale.reducer';

describe('Locale Reducer', () => {
  describe('initialState', () => {
    it('should have nothing in it when unmodified', () => {
      expect(initialState.current).toBeUndefined();
      expect(initialState.locales).toBeEmpty();
    });
  });

  describe('unknown handling', () => {
    it('should supply a initialState when called with an undefined state', () => {
      const response = localeReducer(undefined, {} as LocaleAction);
      expect(response).toEqual(initialState);
    });

    it('should supply the original state when called with an unknown action', () => {
      const response = localeReducer(initialState, {} as LocaleAction);
      expect(response).toEqual(initialState);
    });
  });

  describe('SelectLocale action', () => {
    it('should set the current element when reduced', () => {
      const action = new SelectLocale({ lang: 'cn' });
      const response = localeReducer(initialState, action);

      expect(response.current).toEqual('cn');
    });
  });

  describe('SetAvailableLocales action', () => {
    it('should set available locales when reduced', () => {
      const locales = [{ lang: 'cn' }, { lang: 'ru' }] as Locale[];

      const action = new SetAvailableLocales({ locales });
      const response = localeReducer(initialState, action);

      expect(response.current).toBeUndefined();
      expect(response.locales).toEqual(locales);
    });

    it('should reset available locales when reduced', () => {
      let action = new SetAvailableLocales({ locales: [{ lang: 'cn' }, { lang: 'ru' }] as Locale[] });
      let response = localeReducer(initialState, action);

      expect(response.current).toBeUndefined();
      expect(response.locales.map(l => l.lang)).toEqual(['cn', 'ru']);

      action = new SetAvailableLocales({ locales: [{ lang: 'de' }, { lang: 'jp' }] as Locale[] });
      response = localeReducer(response, action);

      expect(response.current).toBeUndefined();
      expect(response.locales.map(l => l.lang)).toEqual(['de', 'jp']);
    });
  });
});
