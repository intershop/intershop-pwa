import { createSelector } from '@ngrx/store';

import { getSentryState } from '../sentry-store';

export const getSentryDSN = createSelector(getSentryState, state => state?.dsn);
