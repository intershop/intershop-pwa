import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';

const getLocaleState = createSelector(
  getCoreState,
  state => state.locale
);

export const getAvailableLocales = createSelector(
  getLocaleState,
  state => state.locales
);

/**
 * selects the current locale if set. If not returns the first available locale
 */
export const getCurrentLocale = createSelector(
  getLocaleState,
  state => (state.current ? state.locales.find(l => l.lang === state.current) : state.locales[0])
);
