import { createReducer, on } from '@ngrx/store';

import { setSentryConfig } from './sentry-config.actions';

export const sentryConfigReducer = createReducer<string>(
  undefined,
  on(setSentryConfig, (_, action): string => action.payload.dsn)
);
