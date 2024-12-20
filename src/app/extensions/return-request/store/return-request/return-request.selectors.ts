import { createSelector } from '@ngrx/store';

import { getReturnRequestsState } from '../return-request-store';

import { initialState, returnRequestAdapter } from './return-request.reducer';

const getReturnRequestState = createSelector(getReturnRequestsState, state => state?.returnRequest ?? initialState);

const { selectAll } = returnRequestAdapter.getSelectors(getReturnRequestState);

export const getReturnRequests = selectAll;

export const getReturnRequestLoading = createSelector(getReturnRequestState, state => state.loading);

export const getReturnRequestError = createSelector(getReturnRequestState, state => state.error);

export const getReasons = createSelector(getReturnRequestState, state => state.reasons);

export const getReturnableItems = createSelector(getReturnRequestState, state => state.orderReturnableItems);

export const getGuestOrders = createSelector(getReturnRequestState, state => state.guestUserOrder);
