import { LocaleAction, LocaleActionTypes } from './locale.actions';
import { Locale } from '../../../models/locale/locale.interface';

export interface LocaleState {
  locale: Locale;
}

export const getLocale = (state: LocaleState) => state.locale;

export const initialState: LocaleState = {
  locale: null
};

export function localeReducer(
  state = initialState,
  action: LocaleAction
): LocaleState {
  switch (action.type) {
    case LocaleActionTypes.SelectLocale: {
      const locale = action.payload;
      return { locale };
    }
  }
  return state;
}
