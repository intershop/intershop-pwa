import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import {
  CreateOrder,
  CreateOrderFail,
  CreateOrderSuccess,
  LoadOrder,
  LoadOrderSuccess,
  LoadOrders,
  LoadOrdersFail,
  LoadOrdersSuccess,
  OrdersAction,
  SelectOrder,
} from './orders.actions';
import { initialState, ordersReducer } from './orders.reducer';

describe('Orders Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as OrdersAction;
      const state = ordersReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('CreateOrder actions', () => {
    describe('CreateOrder action', () => {
      it('should set loading to true', () => {
        const action = new CreateOrder({ basketId: BasketMockData.getBasket().id });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateOrderSuccess action', () => {
      it('should add new order to initial state and select it', () => {
        const order = { id: 'orderid' } as Order;
        const action = new CreateOrderSuccess({ order });
        const state = ordersReducer(initialState, action);

        expect(state.entities[order.id]).toEqual(order);
        expect(state.selected).toEqual(order.id);
      });
    });

    describe('CreateOrderFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new CreateOrderFail({ error });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });
  });

  describe('LoadOrders actions', () => {
    describe('LoadOrders action', () => {
      it('should set loading to true', () => {
        const action = new LoadOrders();
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrdersFail action', () => {
      it('should set loading to false', () => {
        const action = new LoadOrdersFail({ error: {} as HttpError });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrdersSuccess action', () => {
      let orders: Order[];

      beforeEach(() => {
        orders = [
          {
            id: '1',
            documentNo: '0000001',
          } as Order,
          {
            id: '2',
            documentNo: '0000002',
          } as Order,
        ];
      });

      it('should insert orders if not exist', () => {
        const action = new LoadOrdersSuccess({ orders });
        const state = ordersReducer(initialState, action);

        expect(state.ids).toHaveLength(2);
        expect(state.entities[orders[0].id].id).toEqual(orders[0].id);
      });
    });
  });

  describe('LoadOrder actions', () => {
    describe('LoadOrder action', () => {
      it('should set loading to true', () => {
        const action = new LoadOrder({ orderId: '12345' });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrderFail action', () => {
      it('should set loading to false', () => {
        const action = new LoadOrdersFail({ error: {} as HttpError });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrderSuccess action', () => {
      let order: Order;

      beforeEach(() => {
        order = {
          id: '1',
          documentNo: '0000001',
        } as Order;
      });

      it('should insert order if not exist', () => {
        const action = new LoadOrderSuccess({ order });
        const state = ordersReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[order.id]).toEqual(order);
      });
    });
  });

  describe('SelectOrder action', () => {
    it('should write the selected order to the state', () => {
      const order = { id: 'orderid' } as Order;
      const action = new SelectOrder({ orderId: order.id });
      const state = ordersReducer(initialState, action);

      expect(state.selected).toEqual(order.id);
    });
  });
});
