import { createFeatureSelector } from '@ngrx/store';

import { QuotingState } from './quoting/quoting.reducer';

export interface Quoting2State {
  quoting: QuotingState;
}

export const getQuoting2State = createFeatureSelector<Quoting2State>('quoting2');
