import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';

import { OrdersAction, OrdersActionTypes } from './orders.actions';

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

export function ordersReducer(state = initialState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case OrdersActionTypes.SelectOrder: {
      return {
        ...state,
        selected: action.payload.orderId,
      };
    }

    case OrdersActionTypes.LoadOrders:
    case OrdersActionTypes.LoadOrder:
    case OrdersActionTypes.CreateOrder: {
      return {
        ...state,
        loading: true,
      };
    }

    case OrdersActionTypes.CreateOrderSuccess:
    case OrdersActionTypes.LoadOrderSuccess: {
      const { order } = action.payload;

      return {
        ...orderAdapter.upsertOne(order, state),
        selected: order.id,
        loading: false,
        error: undefined,
      };
    }

    case OrdersActionTypes.LoadOrdersSuccess: {
      const { orders } = action.payload;
      return {
        ...orderAdapter.setAll(orders, state),
        loading: false,
        error: undefined,
      };
    }

    case OrdersActionTypes.LoadOrdersFail:
    case OrdersActionTypes.LoadOrderFail:
    case OrdersActionTypes.CreateOrderFail: {
      const { error } = action.payload;
      return {
        ...state,
        error,
        loading: false,
      };
    }

    case OrdersActionTypes.ResetOrders: {
      return initialState;
    }
  }

  return state;
}
