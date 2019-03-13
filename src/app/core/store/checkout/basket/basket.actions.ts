import { Action } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemQuantity } from 'ish-core/models/line-item-quantity/line-item-quantity.model';
import { Link } from 'ish-core/models/link/link.model';
import { Order } from 'ish-core/models/order/order.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { BasketUpdateType } from '../../../services/basket/basket.service';

export enum BasketActionTypes {
  LoadBasket = '[Basket Internal] Load Basket',
  LoadBasketFail = '[Basket API] Load Basket Fail',
  LoadBasketSuccess = '[Basket API] Load Basket Success',
  CreateBasketAddress = '[Basket] Create Basket Address',
  CreateBasketAddressSuccess = '[Basket Internal] Create Basket Address Success',
  AssignBasketAddress = '[Basket] Assign an Address to the Basket',
  UpdateBasketAddress = '[Basket] Update an Address at Basket',
  UpdateBasketShippingMethod = '[Basket] Update Baskets Shipping Method',
  UpdateBasket = '[Basket Internal] Update Basket',
  UpdateBasketFail = '[Basket API] Update Basket Fail',
  DeleteBasketShippingAddress = '[Basket] Delete Basket Shipping Address',
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
  constructor(public payload?: { id: string }) {}
}

export class LoadBasketFail implements Action {
  readonly type = BasketActionTypes.LoadBasketFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadBasketSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketSuccess;
  constructor(public payload: { basket: Basket }) {}
}

export class CreateBasketAddress implements Action {
  readonly type = BasketActionTypes.CreateBasketAddress;
  constructor(public payload: { address: Address; scope: 'invoice' | 'shipping' | 'any' }) {}
}

export class CreateBasketAddressSuccess implements Action {
  readonly type = BasketActionTypes.CreateBasketAddressSuccess;
  constructor(public payload: { address: Address; scope: 'invoice' | 'shipping' | 'any' }) {}
}

export class AssignBasketAddress implements Action {
  readonly type = BasketActionTypes.AssignBasketAddress;
  constructor(public payload: { addressId: string; scope: 'invoice' | 'shipping' | 'any' }) {}
}

export class UpdateBasketAddress implements Action {
  readonly type = BasketActionTypes.UpdateBasketAddress;
  constructor(public payload: { address: Address }) {}
}

/* payload: Shipping Method Id */
export class UpdateBasketShippingMethod implements Action {
  readonly type = BasketActionTypes.UpdateBasketShippingMethod;
  constructor(public payload: { shippingId: string }) {}
}

export class UpdateBasket implements Action {
  readonly type = BasketActionTypes.UpdateBasket;
  constructor(public payload: { update: BasketUpdateType }) {}
}

export class UpdateBasketFail implements Action {
  readonly type = BasketActionTypes.UpdateBasketFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteBasketShippingAddress implements Action {
  readonly type = BasketActionTypes.DeleteBasketShippingAddress;
  constructor(public payload: { addressId: string }) {}
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
  constructor(public payload: { error: HttpError }) {}
}

export class AddItemsToBasketSuccess implements Action {
  readonly type = BasketActionTypes.AddItemsToBasketSuccess;
}

export class AddQuoteToBasket implements Action {
  readonly type = BasketActionTypes.AddQuoteToBasket;
  constructor(public payload: { quoteId: string }) {}
}

export class AddQuoteToBasketFail implements Action {
  readonly type = BasketActionTypes.AddQuoteToBasketFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddQuoteToBasketSuccess implements Action {
  readonly type = BasketActionTypes.AddQuoteToBasketSuccess;
  constructor(public payload: { link: Link }) {}
}

export class UpdateBasketItems implements Action {
  readonly type = BasketActionTypes.UpdateBasketItems;
  constructor(public payload: { lineItemQuantities: LineItemQuantity[] }) {}
}

export class UpdateBasketItemsFail implements Action {
  readonly type = BasketActionTypes.UpdateBasketItemsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateBasketItemsSuccess implements Action {
  readonly type = BasketActionTypes.UpdateBasketItemsSuccess;
}

export class DeleteBasketItem implements Action {
  readonly type = BasketActionTypes.DeleteBasketItem;
  constructor(public payload: { itemId: string }) {}
}

export class DeleteBasketItemFail implements Action {
  readonly type = BasketActionTypes.DeleteBasketItemFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteBasketItemSuccess implements Action {
  readonly type = BasketActionTypes.DeleteBasketItemSuccess;
}

export class LoadBasketEligibleShippingMethods implements Action {
  readonly type = BasketActionTypes.LoadBasketEligibleShippingMethods;
}

export class LoadBasketEligibleShippingMethodsFail implements Action {
  readonly type = BasketActionTypes.LoadBasketEligibleShippingMethodsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadBasketEligibleShippingMethodsSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketEligibleShippingMethodsSuccess;
  constructor(public payload: { shippingMethods: ShippingMethod[] }) {}
}

export class LoadBasketEligiblePaymentMethods implements Action {
  readonly type = BasketActionTypes.LoadBasketEligiblePaymentMethods;
}

export class LoadBasketEligiblePaymentMethodsFail implements Action {
  readonly type = BasketActionTypes.LoadBasketEligiblePaymentMethodsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadBasketEligiblePaymentMethodsSuccess implements Action {
  readonly type = BasketActionTypes.LoadBasketEligiblePaymentMethodsSuccess;
  constructor(public payload: { paymentMethods: PaymentMethod[] }) {}
}
export class SetBasketPayment implements Action {
  readonly type = BasketActionTypes.SetBasketPayment;
  constructor(public payload: { id: string }) {}
}

export class SetBasketPaymentFail implements Action {
  readonly type = BasketActionTypes.SetBasketPaymentFail;
  constructor(public payload: { error: HttpError }) {}
}

export class SetBasketPaymentSuccess implements Action {
  readonly type = BasketActionTypes.SetBasketPaymentSuccess;
}

export class ResetBasket implements Action {
  readonly type = BasketActionTypes.ResetBasket;
}

export class CreateOrder implements Action {
  readonly type = BasketActionTypes.CreateOrder;
  constructor(public payload: { basket: Basket }) {}
}

export class CreateOrderFail implements Action {
  readonly type = BasketActionTypes.CreateOrderFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateOrderSuccess implements Action {
  readonly type = BasketActionTypes.CreateOrderSuccess;
  constructor(public payload: { order: Order }) {}
}

export type BasketAction =
  | LoadBasket
  | LoadBasketFail
  | LoadBasketSuccess
  | CreateBasketAddress
  | CreateBasketAddressSuccess
  | AssignBasketAddress
  | UpdateBasketAddress
  | UpdateBasketShippingMethod
  | UpdateBasket
  | UpdateBasketFail
  | DeleteBasketShippingAddress
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
  | SetBasketPayment
  | SetBasketPaymentFail
  | SetBasketPaymentSuccess
  | ResetBasket
  | CreateOrder
  | CreateOrderFail
  | CreateOrderSuccess;
