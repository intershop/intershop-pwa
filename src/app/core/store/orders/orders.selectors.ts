import { createSelector } from '@ngrx/store';

import { CoreState } from '../core.state';

import { orderAdapter } from './orders.reducer';

const getOrdersState = (state: CoreState) => state.orders;

export const { selectEntities: getOrderEntities, selectAll: getOrders } = orderAdapter.getSelectors(getOrdersState);

export const getOrdersLoading = createSelector(getOrdersState, orders => orders.loading);
