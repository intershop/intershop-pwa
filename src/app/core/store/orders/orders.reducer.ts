import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { HttpError } from '../../../models/http-error/http-error.model';
import { Order } from '../../../models/order/order.model';

import { OrdersAction, OrdersActionTypes } from './orders.actions';

export const orderAdapter = createEntityAdapter<Order>({
  selectId: order => order.id,
});

export interface OrdersState extends EntityState<Order> {
  loading: boolean;
  error: HttpError;
}

export const initialState: OrdersState = orderAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export function ordersReducer(state = initialState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case OrdersActionTypes.LoadOrders: {
      return {
        ...state,
        loading: true,
      };
    }

    case OrdersActionTypes.LoadOrdersFail: {
      const error = action.payload;
      return {
        ...state,
        error: error,
        loading: false,
      };
    }

    case OrdersActionTypes.LoadOrdersSuccess: {
      const loadedOrders = action.payload;
      return {
        ...orderAdapter.addAll(loadedOrders, state),
        loading: false,
      };
    }

    case OrdersActionTypes.ResetOrders: {
      return initialState;
    }
  }

  return state;
}
