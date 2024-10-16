import { Params } from '@angular/router';
import { createAction } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidation, BasketValidationScopeType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';
import { ErrorFeedback } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { AddLineItemType, LineItem } from 'ish-core/models/line-item/line-item.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { BasketUpdateType } from 'ish-core/services/basket/basket.service';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadBasket = createAction('[Basket Internal] Load Basket');

export const loadBasketWithId = createAction('[Basket] Load Basket with ID', payload<{ basketId: string }>());

export const loadBasketByAPIToken = createAction(
  '[Basket Internal] Load Basket by API Token',
  payload<{ apiToken: string }>()
);

export const loadBasketByAPITokenFail = createAction('[Basket API] Load Basket by API Token Fail', httpError());

export const loadBasketFail = createAction('[Basket API] Load Basket Fail', httpError());

export const loadBasketSuccess = createAction('[Basket API] Load Basket Success', payload<{ basket: Basket }>());

export const createBasket = createAction('[Basket] Create Basket');

export const createBasketFail = createAction('[Basket API] Create Basket Fail', httpError());

export const createBasketSuccess = createAction('[Basket API] Create Basket Success', payload<{ basket: Basket }>());

export const createBasketAddress = createAction(
  '[Basket] Create Basket Address',
  payload<{ address: Address; scope: 'invoice' | 'shipping' | 'any' }>()
);

export const createBasketAddressSuccess = createAction(
  '[Basket API] Create Basket Address Success',
  payload<{ address: Address; scope: 'invoice' | 'shipping' | 'any' }>()
);

export const createBasketAddressFail = createAction('[Basket API] Create Basket Address Fail', httpError());

export const assignBasketAddress = createAction(
  '[Basket] Assign an Address to the Basket',
  payload<{ addressId: string; scope: 'invoice' | 'shipping' | 'any' }>()
);

export const updateBasketAddress = createAction(
  '[Basket] Update an Address at Basket',
  payload<{ address: Address }>()
);

export const updateBasketShippingMethod = createAction(
  '[Basket] Update Baskets Shipping Method',
  payload<{ shippingId: string }>()
);

export const updateBasketCostCenter = createAction(
  '[Basket] Assign a Cost Center at Basket ',
  payload<{ costCenter: string }>()
);

export const updateBasketRecurrence = createAction(
  '[Basket] Set the Recurrence Information at Basket ',
  payload<{ recurrence: Recurrence }>()
);

export const addMessageToMerchant = createAction(
  '[Basket] Message to Merchant',
  payload<{ messageToMerchant: string }>()
);
export const updateBasket = createAction('[Basket] Update Basket', payload<{ update: BasketUpdateType }>());

export const updateBasketFail = createAction('[Basket API] Update Basket Fail', httpError());

export const deleteBasketShippingAddress = createAction(
  '[Basket] Delete Basket Shipping Address',
  payload<{ addressId: string }>()
);

export const addProductToBasket = createAction('[Basket] Add Product', payload<AddLineItemType>());

export const addItemsToBasket = createAction(
  '[Basket Internal] Add Items To Basket',
  payload<{ items: AddLineItemType[] }>()
);

export const addItemsToBasketFail = createAction('[Basket API] Add Items To Basket Fail', httpError());

export const addItemsToBasketSuccess = createAction(
  '[Basket API] Add Items To Basket Success',
  payload<{ lineItems: LineItem[]; info: BasketInfo[]; errors?: ErrorFeedback[] }>()
);

export const mergeBasketInProgress = createAction('[Basket API] Merge two baskets in progress');

export const mergeBasketFail = createAction('[Basket API] Merge two baskets Fail', httpError());

export const mergeBasketSuccess = createAction('[Basket API] Merge two baskets Success', payload<{ basket: Basket }>());

export const validateBasket = createAction(
  '[Basket Internal] Validate Basket',
  payload<{ scopes: BasketValidationScopeType[] }>()
);

export const startCheckout = createAction('[Basket] Start the checkout process');

export const startCheckoutSuccess = createAction(
  '[Basket API] Start the checkout process success',
  payload<{ basketValidation: BasketValidation; targetRoute?: string }>()
);

export const startCheckoutFail = createAction('[Basket API] Start the checkout process fail', httpError());

export const startFastCheckout = createAction('[Basket] Start FastCheckout Process ', payload<{ paymentId: string }>());

export const continueCheckout = createAction(
  '[Basket] Validate Basket and continue checkout',
  payload<{ targetStep: CheckoutStepType }>()
);

export const continueCheckoutFail = createAction(
  '[Basket API] Validate Basket and continue checkout Fail',
  httpError()
);

export const continueCheckoutSuccess = createAction(
  '[Basket API] Validate Basket and continue with success',
  payload<{ targetRoute: string; basketValidation: BasketValidation }>()
);

export const continueCheckoutWithIssues = createAction(
  '[Basket API] Validate Basket and continue with issues',
  payload<{ targetRoute: string; basketValidation: BasketValidation }>()
);

export const continueWithFastCheckout = createAction(
  '[Basket Internal] Validate Basket and continue with fast checkout',
  payload<{ targetRoute: string; basketValidation: BasketValidation; paymentId: string }>()
);

export const updateBasketItem = createAction(
  '[Basket] Update Basket Item',
  payload<{ lineItemUpdate: LineItemUpdate }>()
);

export const updateBasketItemFail = createAction('[Basket API] Update Basket Item Fail', httpError());

export const updateBasketItemSuccess = createAction(
  '[Basket API] Update Basket Item Success',
  payload<{ lineItem: LineItem; info: BasketInfo[] }>()
);

export const deleteBasketItem = createAction('[Basket] Delete Basket Item', payload<{ itemId: string }>());

export const deleteBasketItemFail = createAction('[Basket API] Delete Basket Item Fail', httpError());

export const deleteBasketItemSuccess = createAction(
  '[Basket API] Delete Basket Item Success',
  payload<{ itemId: string; info: BasketInfo[] }>()
);

export const deleteBasketItems = createAction('[Basket] Delete Basket Items');

export const deleteBasketItemsFail = createAction('[Basket API] Delete Basket Items Fail', httpError());

export const deleteBasketItemsSuccess = createAction(
  '[Basket API] Delete Basket Items Success',
  payload<{ info: BasketInfo[] }>()
);

export const removePromotionCodeFromBasket = createAction(
  '[Basket] Remove Promotion Code From Basket',
  payload<{ code: string }>()
);

export const removePromotionCodeFromBasketFail = createAction(
  '[Basket API] Remove Promotion Code From Basket Fail',
  httpError()
);

export const removePromotionCodeFromBasketSuccess = createAction(
  '[Basket API] Remove Promotion Code From Basket Success'
);

export const addPromotionCodeToBasket = createAction(
  '[Basket] Add Promotion Code To Basket',
  payload<{ code: string }>()
);

export const addPromotionCodeToBasketFail = createAction('[Basket API] Add Promotion Code To Basket Fail', httpError());

export const addPromotionCodeToBasketSuccess = createAction('[Basket API] Add Promotion Code To Basket Success');

export const setBasketAttribute = createAction(
  '[Basket] Add or Update Basket Attribute',
  payload<{ attribute: Attribute }>()
);

export const setBasketAttributeFail = createAction('[Basket API] Add or Update Basket Attribute Fail', httpError());

export const setBasketAttributeSuccess = createAction('[Basket API] Add or Update Basket Attribute Success');

export const deleteBasketAttribute = createAction(
  '[Basket] Delete Basket Attribute',
  payload<{ attributeName: string }>()
);

export const deleteBasketAttributeFail = createAction('[Basket API] Delete Basket Attribute Fail', httpError());

export const deleteBasketAttributeSuccess = createAction('[Basket API] Delete Basket Attribute Success');

export const loadBasketEligibleAddresses = createAction('[Basket] Load Basket Eligible Addresses');

export const loadBasketEligibleAddressesFail = createAction(
  '[Basket API] Load Basket Eligible Addresses Fail',
  httpError()
);

export const loadBasketEligibleAddressesSuccess = createAction(
  '[Basket API] Load Basket Eligible Addresses Success',
  payload<{ addresses: Address[] }>()
);

export const loadBasketEligibleShippingMethods = createAction('[Basket] Load Basket Eligible Shipping Methods');

export const loadBasketEligibleShippingMethodsFail = createAction(
  '[Basket API] Load Basket Eligible Shipping Methods Fail',
  httpError()
);

export const loadBasketEligibleShippingMethodsSuccess = createAction(
  '[Basket API] Load Basket Eligible Shipping Methods Success',
  payload<{ shippingMethods: ShippingMethod[] }>()
);

export const loadBasketEligiblePaymentMethods = createAction('[Basket] Load Basket Eligible Payment Methods');

export const loadBasketEligiblePaymentMethodsFail = createAction(
  '[Basket API] Load Basket Eligible Payment Methods Fail',
  httpError()
);

export const loadBasketEligiblePaymentMethodsSuccess = createAction(
  '[Basket API] Load Basket Eligible Payment Methods Success',
  payload<{ paymentMethods: PaymentMethod[] }>()
);

export const setBasketPayment = createAction('[Basket] Set a Payment at Basket ', payload<{ id: string }>());

export const setBasketPaymentFail = createAction('[Basket API] Set a Payment at Basket Fail', httpError());

export const setBasketPaymentSuccess = createAction('[Basket API] Set a Payment at Basket Success');

export const createBasketPayment = createAction(
  '[Basket] Create a Basket Payment',
  payload<{ paymentInstrument: PaymentInstrument; saveForLater: boolean }>()
);

export const createBasketPaymentFail = createAction('[Basket API] Create a Basket Payment Fail', httpError());

export const createBasketPaymentSuccess = createAction('[Basket API] Create a Basket Payment Success');

export const updateBasketPayment = createAction(
  '[Basket Internal] Update a Basket Payment with Redirect Data',
  payload<{ params: Params }>()
);

export const updateBasketPaymentFail = createAction('[Basket API] Update a Basket Payment Fail', httpError());

export const updateBasketPaymentSuccess = createAction('[Basket API] Update a Basket Payment Success');

export const deleteBasketPayment = createAction(
  '[Basket] Delete Basket Payment',
  payload<{ paymentInstrument: PaymentInstrument }>()
);

export const deleteBasketPaymentFail = createAction('[Basket API] Delete Basket Payment Fail', httpError());

export const deleteBasketPaymentSuccess = createAction('[Basket API] Delete Basket Payment Success');

export const submitBasket = createAction('[Basket API] Submit a Basket for Approval');

export const submitBasketSuccess = createAction('[Basket API] Submit a Basket for Approval Success');

export const submitBasketFail = createAction('[Basket API] Submit a Basket for Approval Fail', httpError());

export const resetBasketErrors = createAction('[Basket Internal] Reset Basket and Basket Promotion Errors');

export const updateConcardisCvcLastUpdated = createAction(
  '[Basket] Update CvcLastUpdated for Concardis Credit Card ',
  payload<{ paymentInstrument: PaymentInstrument }>()
);

export const updateConcardisCvcLastUpdatedFail = createAction(
  '[Basket API] Update CvcLastUpdated for Concardis Credit Card Fail',
  httpError()
);

export const updateConcardisCvcLastUpdatedSuccess = createAction(
  '[Basket API] Update CvcLastUpdated for Concardis Credit Card Success',
  payload<{ paymentInstrument: PaymentInstrument }>()
);

export const submitOrder = createAction('[Basket] Basket Submit Order');

export const setBasketDesiredDeliveryDate = createAction(
  '[Basket] Add or Update Basket Desired Delivery Date',
  payload<{ desiredDeliveryDate: string }>() // international iso date format yyyy-mm-dd
);

export const setBasketDesiredDeliveryDateFail = createAction(
  '[Basket API] Add or Update Basket Desired Delivery Date Fail',
  httpError()
);

export const setBasketDesiredDeliveryDateSuccess = createAction(
  '[Basket API] Add or Update Basket Desired Delivery Date Success'
);
