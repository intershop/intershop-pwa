import { createFeatureSelector } from '@ngrx/store';

export interface SentryState {
  dsn: string;
}

export const getSentryState = createFeatureSelector<SentryState>('sentry');
