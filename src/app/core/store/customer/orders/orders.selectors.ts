import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

import { orderAdapter } from './orders.reducer';

const getOrdersState = createSelector(getCustomerState, state => state.orders);

const { selectEntities, selectAll } = orderAdapter.getSelectors(getOrdersState);

export const getSelectedOrderId = createSelector(getOrdersState, state => state.selected);

export const getSelectedOrder = createSelector(
  selectEntities,
  getSelectedOrderId,
  (entities, id) => id && entities[id]
);

export const getOrders = selectAll;

export const getOrder = (orderId: string) =>
  createSelector(selectAll, entities => entities.find(e => e.id === orderId));

export const getOrdersLoading = createSelector(getOrdersState, orders => orders.loading);

export const getOrdersError = createSelector(getOrdersState, orders => orders.error);
