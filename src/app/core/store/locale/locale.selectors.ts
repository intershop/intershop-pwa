import { createSelector } from '@ngrx/store';

import { getCoreState } from '../core-store';

import { getAvailable, getCurrent } from './locale.reducer';

const getLocaleState = createSelector(
  getCoreState,
  state => state.locale
);

export const getCurrentLocale = createSelector(
  getLocaleState,
  getCurrent
);

export const getAvailableLocales = createSelector(
  getLocaleState,
  getAvailable
);
