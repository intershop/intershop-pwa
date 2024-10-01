import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';
import { getCustomerState } from 'ish-core/store/customer/customer-store';

import { initialState, recurringOrdersAdapter } from './recurring-orders.reducer';

const getRecurringOrdersState = createSelector(getCustomerState, state =>
  state ? state.recurringOrders : initialState
);

export const getRecurringOrdersLoading = createSelector(getRecurringOrdersState, state => state.loading);

export const getRecurringOrdersError = createSelector(getRecurringOrdersState, state => state.error);

const getRecurringOrdersContexts = createSelector(getRecurringOrdersState, state => state.contexts);

export const { selectEntities, selectAll } = recurringOrdersAdapter.getSelectors(getRecurringOrdersState);

export const getRecurringOrders = (context: string = 'MY') =>
  createSelector(selectEntities, getRecurringOrdersContexts, (requisitions, contexts) =>
    contexts[context]?.map(id => requisitions[id])
  );

export const getSelectedRecurringOrder = createSelector(
  selectRouteParam('recurringOrderId'),
  selectEntities,
  (id, entities) => id && entities[id]
);

export const getRecurringOrder = (recurringOrderId: string) =>
  createSelector(selectEntities, entities => recurringOrderId && entities[recurringOrderId]);
