import { Params } from '@angular/router';
import { createAction } from '@ngrx/store';

import { Order } from 'ish-core/models/order/order.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const createOrder = createAction('[Orders] Create Order');

export const createOrderFail = createAction('[Orders API] Create Order Fail', httpError());

export const createOrderSuccess = createAction('[Orders API] Create Order Success', payload<{ order: Order }>());

export const loadOrders = createAction('[Orders Internal] Load Orders');

export const loadOrdersFail = createAction('[Orders API] Load Orders Fail', httpError());

export const loadOrdersSuccess = createAction('[Orders API] Load Orders Success', payload<{ orders: Order[] }>());

export const loadOrder = createAction('[Orders Internal] Load Order', payload<{ orderId: string }>());

export const loadOrderByAPIToken = createAction(
  '[Orders Internal] Load Order using given API Token',
  payload<{ apiToken: string; orderId: string }>()
);

export const loadOrderFail = createAction('[Orders API] Load Order Fail', httpError());

export const loadOrderSuccess = createAction('[Orders API] Load Order Success', payload<{ order: Order }>());

export const selectOrder = createAction('[Orders] Select Order', payload<{ orderId: string }>());

export const selectOrderAfterRedirect = createAction(
  '[Orders Internal] Select Order After Checkout Redirect',
  payload<{ params: Params }>()
);

export const selectOrderAfterRedirectFail = createAction(
  '[Orders API] Select Order Fail After Checkout Redirect',
  httpError()
);
