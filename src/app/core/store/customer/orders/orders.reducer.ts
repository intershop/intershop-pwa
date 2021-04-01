import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  createOrder,
  createOrderFail,
  createOrderSuccess,
  loadOrder,
  loadOrderFail,
  loadOrderSuccess,
  loadOrders,
  loadOrdersFail,
  loadOrdersSuccess,
  selectOrder,
} from './orders.actions';

export const orderAdapter = createEntityAdapter<Order>({
  selectId: order => order.id,
});

export interface OrdersState extends EntityState<Order> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const initialState: OrdersState = orderAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const ordersReducer = createReducer(
  initialState,
  setLoadingOn(createOrder, loadOrder, loadOrders),
  unsetLoadingAndErrorOn(createOrderSuccess, loadOrderSuccess, loadOrdersSuccess),
  setErrorOn(loadOrdersFail, loadOrderFail, createOrderFail),
  on(selectOrder, (state, action) => ({
    ...state,
    selected: action.payload.orderId,
  })),

  on(createOrderSuccess, loadOrderSuccess, (state, action) => {
    const { order } = action.payload;

    return {
      ...orderAdapter.upsertOne(order, state),
      selected: order.id,
    };
  }),
  on(loadOrdersSuccess, (state, action) => {
    const { orders } = action.payload;
    return {
      ...orderAdapter.setAll(orders, state),
    };
  })
);
