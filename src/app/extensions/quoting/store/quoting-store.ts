import { createSelector } from '@ngrx/store';

import { QuotingInternalState } from './quoting/quoting.reducer';

export interface QuotingState {
  quoting: QuotingInternalState;
}

export const getQuotingState = createSelector(
  (state: { quoting?: QuotingState }) => state.quoting,
  quoting => quoting
);
