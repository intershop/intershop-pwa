import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { BasketItem } from '../../../models/basket/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';

export enum BasketActionTypes {
  LoadBasket = '[Checkout] Load Basket',
  LoadBasketFail = '[Checkout] Load Basket Fail',
  LoadBasketSuccess = '[Checkout] Load Basket Success',
  LoadBasketItems = '[Chekout] Load Basket Items',
  LoadBasketItemsFail = '[Chekout] Load Basket Items Fail',
  LoadBasketItemsSuccess = '[Chekout] Load Basket Items Success',
  AddItemToBasket = '[Checkout] Add Item To Basket',
  AddItemToBasketFail = '[Checkout] Add Item To Basket Fail',
  AddItemToBasketSuccess = '[Checkout] Add Item To Basket Success',
}

export class LoadBasket implements Action {
  readonly type = BasketActionTypes.LoadBasket;
  constructor(public payload?: string) {}
}

export class LoadBasketFail implements Action {
  readonly type = BasketActionTypes.LoadBasketFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadBasketSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketSuccess;
  constructor(public payload: Basket) {}
}

export class LoadBasketItems implements Action {
  readonly type = BasketActionTypes.LoadBasketItems;
  constructor(public payload: string) {}
}

export class LoadBasketItemsFail implements Action {
  readonly type = BasketActionTypes.LoadBasketItemsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadBasketItemsSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketItemsSuccess;
  constructor(public payload: BasketItem[]) {}
}

export class AddItemToBasket implements Action {
  readonly type = BasketActionTypes.AddItemToBasket;
  constructor(public payload: { sku: string; quantity: number }) {}
}

export class AddItemToBasketFail implements Action {
  readonly type = BasketActionTypes.AddItemToBasketFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class AddItemToBasketSuccess implements Action {
  readonly type = BasketActionTypes.AddItemToBasketSuccess;
}

export type BasketAction =
  | LoadBasket
  | LoadBasketFail
  | LoadBasketSuccess
  | LoadBasketItems
  | LoadBasketItemsFail
  | LoadBasketItemsSuccess
  | AddItemToBasket
  | AddItemToBasketFail
  | AddItemToBasketSuccess;
