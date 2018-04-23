import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';

export enum BasketActionTypes {
  LoadBasket = '[Basket Internal] Load Basket',
  LoadBasketFail = '[Basket API] Load Basket Fail',
  LoadBasketSuccess = '[Basket API] Load Basket Success',
  LoadBasketItems = '[Basket Internal] Load Basket Items',
  LoadBasketItemsFail = '[Basket API] Load Basket Items Fail',
  LoadBasketItemsSuccess = '[Basket API] Load Basket Items Success',
  AddProductToBasket = '[Basket] Add Product',
  AddItemsToBasket = '[Basket Internal] Add Items To Basket',
  AddItemsToBasketFail = '[Basket API] Add Item To Basket Fail',
  AddItemsToBasketSuccess = '[Basket API] Add Item To Basket Success',
  UpdateBasketItem = '[Checkout] Update a Basket Item',
  UpdateBasketItemFail = '[Checkout] Update a Basket Item Fail',
  UpdateBasketItemSuccess = '[Checkout] Update a Basket Item Success',
  UpdateBasketItems = '[Checkout] Update a Basket Items',
  DeleteBasketItem = '[Checkout] Delete a Basket Item',
  DeleteBasketItemFail = '[Checkout] Delete a Basket Item Fail',
  DeleteBasketItemSuccess = '[Checkout] Delete a Basket Item Success',
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

export class AddProductToBasket implements Action {
  readonly type = BasketActionTypes.AddProductToBasket;
  constructor(public payload: { sku: string; quantity: number }) {}
}

export class AddItemsToBasket implements Action {
  readonly type = BasketActionTypes.AddItemsToBasket;
  constructor(public payload: { items: { sku: string; quantity: number }[]; basketId?: string }) {}
}

export class AddItemsToBasketFail implements Action {
  readonly type = BasketActionTypes.AddItemsToBasketFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class AddItemsToBasketSuccess implements Action {
  readonly type = BasketActionTypes.AddItemsToBasketSuccess;
}

export class UpdateBasketItem implements Action {
  readonly type = BasketActionTypes.UpdateBasketItem;
  // TODO: add basketId if multibasket functionality is needed
  constructor(public payload: { itemId: string; quantity: number }) {}
}

export class UpdateBasketItemFail implements Action {
  readonly type = BasketActionTypes.UpdateBasketItemFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateBasketItemSuccess implements Action {
  readonly type = BasketActionTypes.UpdateBasketItemSuccess;
}

export class UpdateBasketItems implements Action {
  readonly type = BasketActionTypes.UpdateBasketItems;
  // TODO: add basketId if multibasket functionality is needed
  constructor(public payload: { itemId: string; quantity: number }[]) {}
}

export class DeleteBasketItem implements Action {
  readonly type = BasketActionTypes.DeleteBasketItem;
  // TODO: add basketId if multibasket functionality is needed
  constructor(public payload: string) {}
}

export class DeleteBasketItemFail implements Action {
  readonly type = BasketActionTypes.DeleteBasketItemFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteBasketItemSuccess implements Action {
  readonly type = BasketActionTypes.DeleteBasketItemSuccess;
}

export type BasketAction =
  | LoadBasket
  | LoadBasketFail
  | LoadBasketSuccess
  | LoadBasketItems
  | LoadBasketItemsFail
  | LoadBasketItemsSuccess
  | AddProductToBasket
  | AddItemsToBasket
  | AddItemsToBasketFail
  | AddItemsToBasketSuccess
  | UpdateBasketItem
  | UpdateBasketItemFail
  | UpdateBasketItemSuccess
  | UpdateBasketItems
  | DeleteBasketItem
  | DeleteBasketItemFail
  | DeleteBasketItemSuccess;
