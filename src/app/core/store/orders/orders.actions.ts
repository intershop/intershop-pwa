import { Params } from '@angular/router';
import { Action } from '@ngrx/store';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from '../../models/http-error/http-error.model';
import { Order } from '../../models/order/order.model';

export enum OrdersActionTypes {
  CreateOrder = '[Order] Create Order',
  CreateOrderFail = '[Order API] Create Order Fail',
  CreateOrderSuccess = '[Order API] Create Order Success',
  SelectOrder = '[Order] Select Order',
  LoadOrders = '[Order] Load Orders',
  LoadOrdersFail = '[Order API] Load Orders Fail',
  LoadOrdersSuccess = '[Order API] Load Orders Success',
  LoadOrder = '[Order] Load Order',
  LoadOrderFail = '[Order API] Load Order Fail',
  LoadOrderSuccess = '[Order API] Load Order Success',
  SelectOrderAfterRedirect = '[Order Internal] Select Order After Checkout Redirect',
  SelectOrderAfterRedirectFail = '[Order API] Select Order Fail After Checkout Redirect',
  ResetOrders = '[Order API] Reset Orders',
}

export class CreateOrder implements Action {
  readonly type = OrdersActionTypes.CreateOrder;
  constructor(public payload: { basket: Basket }) {}
}

export class CreateOrderFail implements Action {
  readonly type = OrdersActionTypes.CreateOrderFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateOrderSuccess implements Action {
  readonly type = OrdersActionTypes.CreateOrderSuccess;
  constructor(public payload: { order: Order }) {}
}

export class LoadOrders implements Action {
  readonly type = OrdersActionTypes.LoadOrders;
}

export class LoadOrdersFail implements Action {
  readonly type = OrdersActionTypes.LoadOrdersFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadOrdersSuccess implements Action {
  readonly type = OrdersActionTypes.LoadOrdersSuccess;
  constructor(public payload: { orders: Order[] }) {}
}

export class LoadOrder implements Action {
  readonly type = OrdersActionTypes.LoadOrder;
  constructor(public payload: { orderId: string }) {}
}

export class LoadOrderFail implements Action {
  readonly type = OrdersActionTypes.LoadOrderFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadOrderSuccess implements Action {
  readonly type = OrdersActionTypes.LoadOrderSuccess;
  constructor(public payload: { order: Order }) {}
}

export class SelectOrder implements Action {
  readonly type = OrdersActionTypes.SelectOrder;
  constructor(public payload: { orderId: string }) {}
}

export class SelectOrderAfterRedirect implements Action {
  readonly type = OrdersActionTypes.SelectOrderAfterRedirect;
  constructor(public payload: { params: Params }) {} // query params
}

export class SelectOrderAfterRedirectFail implements Action {
  readonly type = OrdersActionTypes.SelectOrderAfterRedirectFail;
  constructor(public payload: { error: HttpError }) {}
}

export class ResetOrders implements Action {
  readonly type = OrdersActionTypes.ResetOrders;
}

export type OrdersAction =
  | CreateOrder
  | CreateOrderFail
  | CreateOrderSuccess
  | LoadOrders
  | LoadOrdersFail
  | LoadOrdersSuccess
  | LoadOrder
  | LoadOrderFail
  | LoadOrderSuccess
  | SelectOrder
  | SelectOrderAfterRedirect
  | SelectOrderAfterRedirectFail
  | ResetOrders;
