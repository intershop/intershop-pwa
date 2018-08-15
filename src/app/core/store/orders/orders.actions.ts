import { Action } from '@ngrx/store';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Order } from '../../../models/order/order.model';

export enum OrdersActionTypes {
  LoadOrders = '[Account] Load Orders',
  LoadOrdersFail = '[Account API] Load Orders Fail',
  LoadOrdersSuccess = '[Account API] Load Orders Success',
  ResetOrders = '[Account API] Reset Orders',
}

export class LoadOrders implements Action {
  readonly type = OrdersActionTypes.LoadOrders;
}

export class LoadOrdersFail implements Action {
  readonly type = OrdersActionTypes.LoadOrdersFail;
  constructor(public payload: HttpError) {}
}

export class LoadOrdersSuccess implements Action {
  readonly type = OrdersActionTypes.LoadOrdersSuccess;
  constructor(public payload: Order[]) {}
}

export class ResetOrders implements Action {
  readonly type = OrdersActionTypes.ResetOrders;
}

export type OrdersAction = LoadOrders | LoadOrdersFail | LoadOrdersSuccess | ResetOrders;
