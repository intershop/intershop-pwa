import { createSelector } from '@ngrx/store';

import { OrderView, createOrderView } from 'ish-core/models/order/order.model';
import { getCoreState } from 'ish-core/store/core-store';
import { getCategoryTree } from 'ish-core/store/shopping/categories';
import { getProductEntities } from 'ish-core/store/shopping/products';

import { orderAdapter } from './orders.reducer';

const getOrdersState = createSelector(
  getCoreState,
  state => state.orders
);

const { selectEntities: getOrderEntities, selectAll: getOrdersInternal } = orderAdapter.getSelectors(getOrdersState);

export const getSelectedOrderId = createSelector(
  getOrdersState,
  state => state.selected
);

export const getSelectedOrder = createSelector(
  getOrderEntities,
  getSelectedOrderId,
  getProductEntities,
  getCategoryTree,
  (entities, id, products, categoryTree): OrderView =>
    id && entities[id] ? createOrderView(entities[id], products, categoryTree) : undefined
);

export const getOrders = createSelector(
  getOrdersInternal,
  getProductEntities,
  getCategoryTree,
  (orders, products, categoryTree): OrderView[] =>
    !orders ? [] : orders.map(e => createOrderView(e, products, categoryTree))
);

export const getOrder = createSelector(
  getOrdersInternal,
  getProductEntities,
  getCategoryTree,
  (entities, products, categoryTree, props: { orderId: string }): OrderView =>
    createOrderView(entities.find(e => e.id === props.orderId), products, categoryTree)
);

export const getOrdersLoading = createSelector(
  getOrdersState,
  orders => orders.loading
);

export const getOrdersError = createSelector(
  getOrdersState,
  orders => orders.error
);
