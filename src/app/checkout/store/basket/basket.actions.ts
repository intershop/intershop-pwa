import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Basket } from '../../../models/basket/basket.model';

export enum BasketActionTypes {
  LoadBasket = '[Checkout] Load Basket',
  LoadBasketFail = '[Checkout] Load Basket Fail',
  LoadBasketSuccess = '[Checkout] Load Basket Success'
}

export class LoadBasket implements Action {
  readonly type = BasketActionTypes.LoadBasket;
  constructor(public payload: string = '-') { }
}

export class LoadBasketFail implements Action {
  readonly type = BasketActionTypes.LoadBasketFail;
  constructor(public payload: HttpErrorResponse) { }
}

export class LoadBasketSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketSuccess;
  constructor(public payload: Basket) { }
}

export type BasketAction =
  | LoadBasket
  | LoadBasketFail
  | LoadBasketSuccess;
