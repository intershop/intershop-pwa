import { createSelector } from '@ngrx/store';

import { BasketHelper } from '../../../models/basket/basket.model';
import { OrderView } from '../../../models/order/order.model';
import { getProductEntities } from '../../../shopping/store/products';
import { CoreState } from '../core.state';

import { orderAdapter } from './orders.reducer';

const getOrdersState = (state: CoreState) => state.orders;

const { selectEntities: getOrderEntities, selectAll: getOrdersInternal } = orderAdapter.getSelectors(getOrdersState);

export const getSelectedOrderId = createSelector(getOrdersState, state => state.selected);

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
          itemsCount: BasketHelper.getBasketItemsCount(entities[id].lineItems),
          lineItems: entities[id].lineItems.map(li => ({
            ...li,
            product: products[li.productSKU],
          })),
        }
);

export const getOrdersLoading = createSelector(getOrdersState, orders => orders.loading);

export const getOrders = createSelector(
  getOrdersInternal,
  getProductEntities,
  (orders, products): OrderView[] =>
    !orders
      ? []
      : orders.map(e => ({
          ...e,
          itemsCount: BasketHelper.getBasketItemsCount(e.lineItems),
          lineItems: e.lineItems.map(li => ({
            ...li,
            product: products[li.productSKU],
          })),
        }))
);
