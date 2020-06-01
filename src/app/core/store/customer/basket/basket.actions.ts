import { Params } from '@angular/router';
import { Action } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidation, BasketValidationScopeType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { BasketUpdateType } from 'ish-core/services/basket/basket.service';

export enum BasketActionTypes {
  LoadBasket = '[Basket Internal] Load Basket',
  LoadBasketByAPIToken = '[Basket Internal] Load Basket by API Token',
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
  MergeBasket = '[Basket Internal] Merge two baskets',
  MergeBasketFail = '[Basket API] Merge two baskets Fail',
  MergeBasketSuccess = '[Basket API] Merge two baskets Success',
  ValidateBasket = '[Basket] Validate Basket',
  ContinueCheckout = '[Basket] Validate Basket and continue checkout',
  ContinueCheckoutFail = '[Basket API] Validate Basket and continue checkout Fail',
  ContinueCheckoutSuccess = '[Basket API] Validate Basket and continue with success',
  ContinueCheckoutWithIssues = '[Basket API] Validate Basket and continue with issues',
  AddPromotionCodeToBasket = '[Basket Internal] Add Promotion Code To Basket',
  AddPromotionCodeToBasketFail = '[Basket API] Add Promotion Code To Basket Fail',
  AddPromotionCodeToBasketSuccess = '[Basket API] Add Promotion Code To Basket Success',
  RemovePromotionCodeFromBasket = '[Basket Internal] Remove Promotion Code From Basket',
  RemovePromotionCodeFromBasketFail = '[Basket API] Remove Promotion Code From Basket Fail',
  RemovePromotionCodeFromBasketSuccess = '[Basket API] Remove Promotion Code From Basket Success',
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
  CreateBasketPayment = '[Basket] Create a Basket Payment',
  CreateBasketPaymentFail = '[Basket API] Create a Basket Payment Fail',
  CreateBasketPaymentSuccess = '[Basket API] Create a Basket Payment Success',
  UpdateBasketPayment = '[Basket] Update a Basket Payment with Redirect Data',
  UpdateBasketPaymentFail = '[Basket API] Update a Basket Payment Fail',
  UpdateBasketPaymentSuccess = '[Basket API] Update a Basket Payment Success',
  DeleteBasketPayment = '[Basket] Delete Basket Payment',
  DeleteBasketPaymentFail = '[Basket API] Delete Basket Payment Fail',
  DeleteBasketPaymentSuccess = '[Basket API] Delete Basket Payment Success',
  ResetBasket = '[Basket Internal] Reset Basket',
  ResetBasketErrors = '[Basket Internal] Reset Basket and Basket Promotion Errors',
}

export class LoadBasket implements Action {
  readonly type = BasketActionTypes.LoadBasket;
  constructor(public payload?: { id: string }) {}
}

export class LoadBasketByAPIToken implements Action {
  readonly type = BasketActionTypes.LoadBasketByAPIToken;
  constructor(public payload?: { apiToken: string }) {}
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
  constructor(public payload: { items: { sku: string; quantity: number; unit: string }[]; basketId?: string }) {}
}

export class AddItemsToBasketFail implements Action {
  readonly type = BasketActionTypes.AddItemsToBasketFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddItemsToBasketSuccess implements Action {
  readonly type = BasketActionTypes.AddItemsToBasketSuccess;
  constructor(public payload: { info: BasketInfo[] }) {}
}

export class MergeBasket implements Action {
  readonly type = BasketActionTypes.MergeBasket;
}

export class MergeBasketFail implements Action {
  readonly type = BasketActionTypes.MergeBasketFail;
  constructor(public payload: { error: HttpError }) {}
}

export class MergeBasketSuccess implements Action {
  readonly type = BasketActionTypes.MergeBasketSuccess;
  constructor(public payload: { basket: Basket }) {}
}

export class ValidateBasket implements Action {
  readonly type = BasketActionTypes.ValidateBasket;
  constructor(public payload: { scopes: BasketValidationScopeType[] }) {}
}

export class ContinueCheckout implements Action {
  readonly type = BasketActionTypes.ContinueCheckout;
  constructor(public payload: { targetStep: number }) {}
}

export class ContinueCheckoutFail implements Action {
  readonly type = BasketActionTypes.ContinueCheckoutFail;
  constructor(public payload: { error: HttpError }) {}
}

export class ContinueCheckoutSuccess implements Action {
  readonly type = BasketActionTypes.ContinueCheckoutSuccess;
  constructor(public payload: { targetRoute: string; basketValidation: BasketValidation }) {}
}

export class ContinueCheckoutWithIssues implements Action {
  readonly type = BasketActionTypes.ContinueCheckoutWithIssues;
  constructor(public payload: { targetRoute: string; basketValidation: BasketValidation }) {}
}

export class UpdateBasketItems implements Action {
  readonly type = BasketActionTypes.UpdateBasketItems;
  constructor(public payload: { lineItemUpdates: LineItemUpdate[] }) {}
}

export class UpdateBasketItemsFail implements Action {
  readonly type = BasketActionTypes.UpdateBasketItemsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateBasketItemsSuccess implements Action {
  readonly type = BasketActionTypes.UpdateBasketItemsSuccess;
  constructor(public payload: { info: BasketInfo[] }) {}
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
  constructor(public payload: { info: BasketInfo[] }) {}
}

export class RemovePromotionCodeFromBasket implements Action {
  readonly type = BasketActionTypes.RemovePromotionCodeFromBasket;
  constructor(public payload: { code: string }) {}
}

export class RemovePromotionCodeFromBasketFail implements Action {
  readonly type = BasketActionTypes.RemovePromotionCodeFromBasketFail;
  constructor(public payload: { error: HttpError }) {}
}

export class RemovePromotionCodeFromBasketSuccess implements Action {
  readonly type = BasketActionTypes.RemovePromotionCodeFromBasketSuccess;
}

export class AddPromotionCodeToBasket implements Action {
  readonly type = BasketActionTypes.AddPromotionCodeToBasket;
  constructor(public payload: { code: string }) {}
}

export class AddPromotionCodeToBasketFail implements Action {
  readonly type = BasketActionTypes.AddPromotionCodeToBasketFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddPromotionCodeToBasketSuccess implements Action {
  readonly type = BasketActionTypes.AddPromotionCodeToBasketSuccess;
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

export class CreateBasketPayment implements Action {
  readonly type = BasketActionTypes.CreateBasketPayment;
  constructor(public payload: { paymentInstrument: PaymentInstrument; saveForLater: boolean }) {}
}

export class CreateBasketPaymentFail implements Action {
  readonly type = BasketActionTypes.CreateBasketPaymentFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateBasketPaymentSuccess implements Action {
  readonly type = BasketActionTypes.CreateBasketPaymentSuccess;
}

export class UpdateBasketPayment implements Action {
  readonly type = BasketActionTypes.UpdateBasketPayment;
  constructor(public payload: { params: Params }) {}
}

export class UpdateBasketPaymentFail implements Action {
  readonly type = BasketActionTypes.UpdateBasketPaymentFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateBasketPaymentSuccess implements Action {
  readonly type = BasketActionTypes.UpdateBasketPaymentSuccess;
}

export class DeleteBasketPayment implements Action {
  readonly type = BasketActionTypes.DeleteBasketPayment;
  constructor(public payload: { paymentInstrument: PaymentInstrument }) {}
}

export class DeleteBasketPaymentFail implements Action {
  readonly type = BasketActionTypes.DeleteBasketPaymentFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteBasketPaymentSuccess implements Action {
  readonly type = BasketActionTypes.DeleteBasketPaymentSuccess;
}

export class ResetBasket implements Action {
  readonly type = BasketActionTypes.ResetBasket;
}

export class ResetBasketErrors implements Action {
  readonly type = BasketActionTypes.ResetBasketErrors;
}

export type BasketAction =
  | LoadBasket
  | LoadBasketByAPIToken
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
  | MergeBasket
  | MergeBasketFail
  | MergeBasketSuccess
  | ValidateBasket
  | ContinueCheckout
  | ContinueCheckoutFail
  | ContinueCheckoutSuccess
  | ContinueCheckoutWithIssues
  | AddPromotionCodeToBasket
  | AddPromotionCodeToBasketFail
  | AddPromotionCodeToBasketSuccess
  | RemovePromotionCodeFromBasket
  | RemovePromotionCodeFromBasketFail
  | RemovePromotionCodeFromBasketSuccess
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
  | CreateBasketPayment
  | CreateBasketPaymentFail
  | CreateBasketPaymentSuccess
  | UpdateBasketPayment
  | UpdateBasketPaymentFail
  | UpdateBasketPaymentSuccess
  | DeleteBasketPayment
  | DeleteBasketPaymentFail
  | DeleteBasketPaymentSuccess
  | ResetBasket
  | ResetBasketErrors;
