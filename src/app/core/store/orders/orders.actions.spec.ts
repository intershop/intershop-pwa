import { HttpError } from '../../../models/http-error/http-error.model';
import { Order } from '../../../models/order/order.model';

import * as fromActions from './orders.actions';

describe('Orders Actions', () => {
  describe('LoadProduct Actions', () => {
    it('should create new action for LoadOrders', () => {
      const action = new fromActions.LoadOrders();

      expect({ ...action }).toEqual({
        type: fromActions.OrdersActionTypes.LoadOrders,
      });
    });

    it('should create new action for LoadOrdersFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoadOrdersFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.OrdersActionTypes.LoadOrdersFail,
        payload,
      });
    });

    it('should create new action for LoadOrdersSuccess', () => {
      const payload = [{ id: '123' }] as Order[];
      const action = new fromActions.LoadOrdersSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.OrdersActionTypes.LoadOrdersSuccess,
        payload,
      });
    });
  });

  describe('Reset Orders Action', () => {
    it('should create new action for Reset Orders', () => {
      const action = new fromActions.ResetOrders();

      expect({ ...action }).toEqual({
        type: fromActions.OrdersActionTypes.ResetOrders,
      });
    });
  });
});
