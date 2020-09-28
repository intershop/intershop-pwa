import { createFeatureSelector } from '@ngrx/store';

import { QuotingInternalState } from './quoting/quoting.reducer';

export interface QuotingState {
  quoting: QuotingInternalState;
}

export const getQuotingState = createFeatureSelector<QuotingState>('quoting');
