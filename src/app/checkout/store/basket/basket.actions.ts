import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { Link } from '../../../models/link/link.model';
import { Order } from '../../../models/order/order.model';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { ShippingMethod } from '../../../models/shipping-method/shipping-method.model';
import { BasketUpdateType } from '../../services/basket/basket.service';

export enum BasketActionTypes {
  LoadBasket = '[Basket Internal] Load Basket',
  LoadBasketFail = '[Basket API] Load Basket Fail',
  LoadBasketSuccess = '[Basket API] Load Basket Success',
  UpdateBasketInvoiceAddress = '[Basket] Update Baskets Invoive Address',
  UpdateBasketShippingAddress = '[Basket] Update Baskets Shipping Address',
  UpdateBasketShippingMethod = '[Basket] Update Baskets Shipping Method',
  UpdateBasket = '[Basket Internal] Update Basket',
  UpdateBasketFail = '[Basket API] Update Basket Fail',
  UpdateBasketSuccess = '[Basket API] Update Basket Success',
  LoadBasketItems = '[Basket Internal] Load Basket Items',
  LoadBasketItemsFail = '[Basket API] Load Basket Items Fail',
  LoadBasketItemsSuccess = '[Basket API] Load Basket Items Success',
  AddProductToBasket = '[Basket] Add Product',
  AddItemsToBasket = '[Basket Internal] Add Items To Basket',
  AddItemsToBasketFail = '[Basket API] Add Items To Basket Fail',
  AddItemsToBasketSuccess = '[Basket API] Add Items To Basket Success',
  AddQuoteToBasket = '[Basket] Add Quote To Basket',
  AddQuoteToBasketFail = '[Basket API] Add Quote To Basket Fail',
  AddQuoteToBasketSuccess = '[Basket API] Add Quote To Basket Success',
  UpdateBasketItems = '[Basket] Update Basket Items',
  UpdateBasketItemsFail = '[Basket API] Update Basket Items Fail',
  UpdateBasketItemsSuccess = '[Basket API] Update Basket Items Success',
  DeleteBasketItem = '[Basket] Delete Basket Item',
  DeleteBasketItemFail = '[Basket API] Delete Basket Item Fail',
  DeleteBasketItemSuccess = '[Basket API] Delete Basket Item Success',
  LoadBasketEligibleShippingMethods = '[Basket] Load Basket Eligible Shipping Methods',
  LoadBasketEligibleShippingMethodsFail = '[Basket API] Load Basket Eligible Shipping Methods Fail',
  LoadBasketEligibleShippingMethodsSuccess = '[Basket API] Load Basket Eligible Shipping Methods Success',
  LoadBasketEligiblePaymentMethods = '[Basket] Load Basket Eligible Payment Methods',
  LoadBasketEligiblePaymentMethodsFail = '[Basket API] Load Basket Eligible Payment Methods Fail',
  LoadBasketEligiblePaymentMethodsSuccess = '[Basket API] Load Basket Eligible Payment Methods Success',
  LoadBasketPayments = '[Basket Internal] Load Basket Payments',
  LoadBasketPaymentsFail = '[Basket API] Load Basket Payments Fail',
  LoadBasketPaymentsSuccess = '[Basket API] Load Basket Payments Success',
  SetBasketPayment = '[Basket] Set a Payment at Basket ',
  SetBasketPaymentFail = '[Basket API] Set a Payment at Basket Fail',
  SetBasketPaymentSuccess = '[Basket API] Set a Payment at Basket Success',
  ResetBasket = '[Basket Internal] Reset Basket',

  CreateOrder = '[Order] Create Order',
  CreateOrderFail = '[Order API] Create Order Fail',
  CreateOrderSuccess = '[Order API] Create Order Success',
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

export class UpdateBasketInvoiceAddress implements Action {
  readonly type = BasketActionTypes.UpdateBasketInvoiceAddress;
  constructor(public payload: string) {}
}

export class UpdateBasketShippingAddress implements Action {
  readonly type = BasketActionTypes.UpdateBasketShippingAddress;
  constructor(public payload: string) {}
}

/* payload: Shipping Method Id */
export class UpdateBasketShippingMethod implements Action {
  readonly type = BasketActionTypes.UpdateBasketShippingMethod;
  constructor(public payload: string) {}
}

export class UpdateBasket implements Action {
  readonly type = BasketActionTypes.UpdateBasket;
  constructor(public payload: BasketUpdateType) {}
}

export class UpdateBasketFail implements Action {
  readonly type = BasketActionTypes.UpdateBasketFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateBasketSuccess implements Action {
  readonly type = BasketActionTypes.UpdateBasketSuccess;
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

export class AddQuoteToBasket implements Action {
  readonly type = BasketActionTypes.AddQuoteToBasket;
  constructor(public payload: string) {}
}

export class AddQuoteToBasketFail implements Action {
  readonly type = BasketActionTypes.AddQuoteToBasketFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class AddQuoteToBasketSuccess implements Action {
  readonly type = BasketActionTypes.AddQuoteToBasketSuccess;
  constructor(public payload: Link) {}
}

export class UpdateBasketItems implements Action {
  readonly type = BasketActionTypes.UpdateBasketItems;
  constructor(public payload: { itemId: string; quantity: number }[]) {}
}

export class UpdateBasketItemsFail implements Action {
  readonly type = BasketActionTypes.UpdateBasketItemsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateBasketItemsSuccess implements Action {
  readonly type = BasketActionTypes.UpdateBasketItemsSuccess;
}

export class DeleteBasketItem implements Action {
  readonly type = BasketActionTypes.DeleteBasketItem;
  constructor(public payload: string) {}
}

export class DeleteBasketItemFail implements Action {
  readonly type = BasketActionTypes.DeleteBasketItemFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteBasketItemSuccess implements Action {
  readonly type = BasketActionTypes.DeleteBasketItemSuccess;
}

export class LoadBasketEligibleShippingMethods implements Action {
  readonly type = BasketActionTypes.LoadBasketEligibleShippingMethods;
}

export class LoadBasketEligibleShippingMethodsFail implements Action {
  readonly type = BasketActionTypes.LoadBasketEligibleShippingMethodsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadBasketEligibleShippingMethodsSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketEligibleShippingMethodsSuccess;
  constructor(public payload: ShippingMethod[]) {}
}

export class LoadBasketEligiblePaymentMethods implements Action {
  readonly type = BasketActionTypes.LoadBasketEligiblePaymentMethods;
}

export class LoadBasketEligiblePaymentMethodsFail implements Action {
  readonly type = BasketActionTypes.LoadBasketEligiblePaymentMethodsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadBasketEligiblePaymentMethodsSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketEligiblePaymentMethodsSuccess;
  constructor(public payload: PaymentMethod[]) {}
}

/* payload: BasketId */
export class LoadBasketPayments implements Action {
  readonly type = BasketActionTypes.LoadBasketPayments;
  constructor(public payload: string) {}
}

export class LoadBasketPaymentsFail implements Action {
  readonly type = BasketActionTypes.LoadBasketPaymentsFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadBasketPaymentsSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketPaymentsSuccess;
  constructor(public payload: PaymentMethod[]) {}
}

/* payload: PaymentName */
export class SetBasketPayment implements Action {
  readonly type = BasketActionTypes.SetBasketPayment;
  constructor(public payload: string) {}
}

export class SetBasketPaymentFail implements Action {
  readonly type = BasketActionTypes.SetBasketPaymentFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class SetBasketPaymentSuccess implements Action {
  readonly type = BasketActionTypes.SetBasketPaymentSuccess;
}

export class ResetBasket implements Action {
  readonly type = BasketActionTypes.ResetBasket;
}

export class CreateOrder implements Action {
  readonly type = BasketActionTypes.CreateOrder;
  constructor(public payload: Basket) {}
}

export class CreateOrderFail implements Action {
  readonly type = BasketActionTypes.CreateOrderFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class CreateOrderSuccess implements Action {
  readonly type = BasketActionTypes.CreateOrderSuccess;
  constructor(public payload: Order) {}
}

export type BasketAction =
  | LoadBasket
  | LoadBasketFail
  | LoadBasketSuccess
  | UpdateBasketInvoiceAddress
  | UpdateBasketShippingAddress
  | UpdateBasketShippingMethod
  | UpdateBasket
  | UpdateBasketFail
  | UpdateBasketSuccess
  | LoadBasketItems
  | LoadBasketItemsFail
  | LoadBasketItemsSuccess
  | AddProductToBasket
  | AddItemsToBasket
  | AddItemsToBasketFail
  | AddItemsToBasketSuccess
  | AddQuoteToBasket
  | AddQuoteToBasketFail
  | AddQuoteToBasketSuccess
  | UpdateBasketItems
  | UpdateBasketItemsFail
  | UpdateBasketItemsSuccess
  | DeleteBasketItem
  | DeleteBasketItemFail
  | DeleteBasketItemSuccess
  | LoadBasketEligibleShippingMethods
  | LoadBasketEligibleShippingMethodsFail
  | LoadBasketEligibleShippingMethodsSuccess
  | LoadBasketEligiblePaymentMethods
  | LoadBasketEligiblePaymentMethodsFail
  | LoadBasketEligiblePaymentMethodsSuccess
  | LoadBasketPayments
  | LoadBasketPaymentsFail
  | LoadBasketPaymentsSuccess
  | SetBasketPayment
  | SetBasketPaymentFail
  | SetBasketPaymentSuccess
  | ResetBasket
  | CreateOrder
  | CreateOrderFail
  | CreateOrderSuccess;
