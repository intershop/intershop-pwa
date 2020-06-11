import { Params } from '@angular/router';
import { createAction } from '@ngrx/store';

import { Order } from 'ish-core/models/order/order.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const createOrder = createAction('[Order] Create Order', payload<{ basketId: string }>());

export const createOrderFail = createAction('[Order API] Create Order Fail', httpError());

export const createOrderSuccess = createAction('[Order API] Create Order Success', payload<{ order: Order }>());

export const loadOrders = createAction('[Order] Load Orders');

export const loadOrdersFail = createAction('[Order API] Load Orders Fail', httpError());

export const loadOrdersSuccess = createAction('[Order API] Load Orders Success', payload<{ orders: Order[] }>());

export const loadOrder = createAction('[Order] Load Order', payload<{ orderId: string }>());

export const loadOrderByAPIToken = createAction(
  '[Order Internal] Load Order using given API Token',
  payload<{ apiToken: string; orderId: string }>()
);

export const loadOrderFail = createAction('[Order API] Load Order Fail', httpError());

export const loadOrderSuccess = createAction('[Order API] Load Order Success', payload<{ order: Order }>());

export const selectOrder = createAction('[Order] Select Order', payload<{ orderId: string }>());

export const selectOrderAfterRedirect = createAction(
  '[Order Internal] Select Order After Checkout Redirect',
  payload<{ params: Params }>()
);

export const selectOrderAfterRedirectFail = createAction(
  '[Order API] Select Order Fail After Checkout Redirect',
  httpError()
);
