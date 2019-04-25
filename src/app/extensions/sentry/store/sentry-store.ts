import { createFeatureSelector } from '@ngrx/store';

import { SentryConfigState } from './sentry-config/sentry-config.reducer';

export interface SentryState {
  config: SentryConfigState;
}

export const getSentryState = createFeatureSelector<SentryState>('sentry');
