import { Locale } from '../../../models/locale/locale.interface';
import { LocaleAction, LocaleActionTypes, SetAvailableLocales } from './locale.actions';

export interface LocaleState {
  current: number;
  available: Locale[];
}

export const getCurrent = (state: LocaleState) => (state.available && state.current >= 0) ? state.available[state.current] : undefined;

export const getAvailable = (state: LocaleState) => state.available;

export const initialState: LocaleState = {
  current: undefined,
  available: undefined,
};

export function localeReducer(
  state = initialState,
  action: LocaleAction
): LocaleState {
  switch (action.type) {
    case LocaleActionTypes.SelectLocale: {
      const currentLocale = action.payload;
      const idx = state.available.findIndex(it => it.lang === currentLocale.lang);
      if (idx >= 0) {
        return { ...state, current: idx };
      }
      // silently drop when language cannot be found
      break;
    }
    case LocaleActionTypes.SetAvailableLocales: {
      const available = (action as SetAvailableLocales).payload;
      return { ...state, available };
    }
  }
  return state;
}
