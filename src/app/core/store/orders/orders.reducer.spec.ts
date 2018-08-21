import { HttpError } from '../../../models/http-error/http-error.model';
import { Order } from '../../../models/order/order.model';

import * as fromActions from './orders.actions';
import { initialState, ordersReducer } from './orders.reducer';

describe('Orders Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as fromActions.OrdersAction;
      const state = ordersReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadOrders actions', () => {
    describe('LoadOrders action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadOrders();
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrdersFail action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.LoadOrdersFail({} as HttpError);
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrdersSuccess action', () => {
      let order: Order;

      beforeEach(() => {
        order = {
          id: '1',
          documentNo: '0000001',
        } as Order;
      });

      it('should insert orders if not exist', () => {
        const action = new fromActions.LoadOrdersSuccess([order]);
        const state = ordersReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[order.id]).toEqual(order);
      });
    });
  });

  describe('ResetOrders action', () => {
    it('should reset to initial state', () => {
      const oldState = {
        ...initialState,
        loading: true,
        orders: [{ ids: ['test'] }],
      };
      const action = new fromActions.ResetOrders();
      const state = ordersReducer(oldState, action);

      expect(state).toEqual(initialState);
    });
  });
});
