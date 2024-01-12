import { createFeatureSelector } from '@ngrx/store';

import { ReturnRequestState } from './return-request/return-request.reducer';

export interface ReturnRequestsState {
  returnRequest: ReturnRequestState;
}

export const getReturnRequestsState = createFeatureSelector<ReturnRequestsState>('returnRequest');
