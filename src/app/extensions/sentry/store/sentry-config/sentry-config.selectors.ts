import { createSelector } from '@ngrx/store';

import { getSentryState } from '../sentry-store';

import { initialState } from './sentry-config.reducer';

const getSentryConfigState = createSelector(
  getSentryState,
  state => (state ? state.config : initialState)
);

export const getSentryDSN = createSelector(
  getSentryConfigState,
  state => state.dsn
);
