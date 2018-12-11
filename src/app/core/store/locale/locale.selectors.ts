import { createSelector } from '@ngrx/store';

import { CoreState } from '../core-store.module';

import { getAvailable, getCurrent } from './locale.reducer';

const getLocaleState = (state: CoreState) => state.locale;

export const getCurrentLocale = createSelector(
  getLocaleState,
  getCurrent
);

export const getAvailableLocales = createSelector(
  getLocaleState,
  getAvailable
);
