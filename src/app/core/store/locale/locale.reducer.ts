import { Locale } from 'ish-core/models/locale/locale.model';

import { LocaleAction, LocaleActionTypes } from './locale.actions';

export interface LocaleState {
  locales: Locale[];
  current: string;
}

export const initialState: LocaleState = {
  locales: [],
  current: undefined,
};

export function localeReducer(state = initialState, action: LocaleAction): LocaleState {
  switch (action.type) {
    case LocaleActionTypes.SelectLocale: {
      const current = action.payload.lang;
      return { ...state, current };
    }
    case LocaleActionTypes.SetAvailableLocales: {
      const { locales } = action.payload;
      return { ...state, locales };
    }
  }
  return state;
}
