import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { HttpError } from '../../models/http-error/http-error.model';
import { Order } from '../../models/order/order.model';
import { BasketAction, BasketActionTypes } from '../checkout/basket';

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

export function ordersReducer(state = initialState, action: OrdersAction | BasketAction): OrdersState {
  switch (action.type) {
    case OrdersActionTypes.SelectOrder: {
      return {
        ...state,
        selected: action.payload.orderId,
      };
    }

    case BasketActionTypes.CreateOrderSuccess: {
      const { order } = action.payload;

      return {
        ...orderAdapter.addOne(order, state),
        selected: order.id,
      };
    }

    case OrdersActionTypes.LoadOrders: {
      return {
        ...state,
        loading: true,
      };
    }

    case OrdersActionTypes.LoadOrdersFail: {
      const { error } = action.payload;
      return {
        ...state,
        error,
        loading: false,
      };
    }

    case OrdersActionTypes.LoadOrdersSuccess: {
      const { orders } = action.payload;
      return {
        ...orderAdapter.addAll(orders, state),
        loading: false,
      };
    }

    case OrdersActionTypes.ResetOrders: {
      return initialState;
    }
  }

  return state;
}
