import { createSelector } from '@ngrx/store';

import { OrderView } from '../../models/order/order.model';
import { getCoreState } from '../core-store';
import { getProductEntities } from '../shopping/products';

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

/*
  ToDo: create a helper method for the duplicated code
  problem: type for input parameter 'products' would be 'Dictionary' which is not part of the public ngrx interface
*/
export const getSelectedOrder = createSelector(
  getOrderEntities,
  getSelectedOrderId,
  getProductEntities,
  (entities, id, products): OrderView =>
    !id || !entities[id]
      ? undefined
      : {
          ...entities[id],
          lineItems: entities[id].lineItems.map(li => ({
            ...li,
            product: products[li.productSKU],
          })),
        }
);

export const getOrdersLoading = createSelector(
  getOrdersState,
  orders => orders.loading
);

export const getOrders = createSelector(
  getOrdersInternal,
  getProductEntities,
  (orders, products): OrderView[] =>
    !orders
      ? []
      : orders.map(e => ({
          ...e,
          lineItems: e.lineItems.map(li => ({
            ...li,
            product: products[li.productSKU],
          })),
        }))
);

export const getOrder = createSelector(
  getOrdersInternal,
  getProductEntities,
  (entities, products, props: { orderId: string }): OrderView => {
    const order = entities.find(e => e.id === props.orderId);

    if (!order) {
      return;
    }
    return {
      ...order,
      lineItems: order.lineItems.map(li => ({
        ...li,
        product: products[li.productSKU],
      })),
    };
  }
);
