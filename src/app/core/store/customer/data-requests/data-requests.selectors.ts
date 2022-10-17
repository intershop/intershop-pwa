import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

const getDataRequestsState = createSelector(getCustomerState, state => state.dataRequests);

export const getDataRequestLoading = createSelector(getDataRequestsState, state => state.loading);

export const getDataRequestError = createSelector(getDataRequestsState, state => state.error);

export const firstGDPRDataRequest = createSelector(getDataRequestsState, state => state.firstGDPRDataRequest);
