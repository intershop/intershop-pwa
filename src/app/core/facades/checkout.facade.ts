import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { merge } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import {
  AddPromotionCodeToBasket,
  AssignBasketAddress,
  ContinueCheckout,
  CreateBasketAddress,
  CreateBasketPayment,
  DeleteBasketItem,
  DeleteBasketPayment,
  DeleteBasketShippingAddress,
  LoadBasketEligiblePaymentMethods,
  LoadBasketEligibleShippingMethods,
  SetBasketPayment,
  UpdateBasketAddress,
  UpdateBasketItems,
  UpdateBasketShippingMethod,
  getBasketEligiblePaymentMethods,
  getBasketEligibleShippingMethods,
  getBasketError,
  getBasketInfo,
  getBasketLastTimeProductAdded,
  getBasketLoading,
  getBasketPromotionError,
  getBasketValidationResults,
  getCurrentBasket,
} from 'ish-core/store/checkout/basket';
import { getCheckoutStep } from 'ish-core/store/checkout/viewconf';
import { CreateOrder, getOrdersError, getSelectedOrder } from 'ish-core/store/orders';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  constructor(private store: Store<{}>) {}

  checkoutStep$ = this.store.pipe(select(getCheckoutStep));

  continue(targetStep: number) {
    this.store.dispatch(new ContinueCheckout({ targetStep }));
  }

  // BASKET
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketChange$ = this.store.pipe(select(getBasketLastTimeProductAdded));
  basketError$ = this.store.pipe(select(getBasketError));
  basketInfo$ = this.store.pipe(select(getBasketInfo));
  basketLoading$ = this.store.pipe(select(getBasketLoading));
  basketValidationResults$ = this.store.pipe(select(getBasketValidationResults));
  basketItemCount$ = this.basket$.pipe(map(basket => (basket && basket.totalProductQuantity) || 0));
  basketItemTotal$ = this.basket$.pipe(map(basket => basket && basket.totals && basket.totals.itemTotal));
  basketLineItems$ = this.basket$.pipe(
    map(basket => (basket && basket.lineItems && basket.lineItems.length ? basket.lineItems : undefined))
  );

  deleteBasketItem(itemId: string) {
    this.store.dispatch(new DeleteBasketItem({ itemId }));
  }

  updateBasketItem(update: LineItemUpdate) {
    this.store.dispatch(new UpdateBasketItems({ lineItemUpdates: [update] }));
  }

  updateBasketShippingMethod(shippingId: string) {
    this.store.dispatch(new UpdateBasketShippingMethod({ shippingId }));
  }

  // ORDERS
  ordersError$ = this.store.pipe(select(getOrdersError));
  basketOrOrdersError$ = merge(this.basketError$, this.ordersError$);
  selectedOrder$ = this.store.pipe(select(getSelectedOrder));

  createOrder(basketId: string) {
    this.store.dispatch(new CreateOrder({ basketId }));
  }

  // SHIPPING
  eligibleShippingMethods$() {
    return this.basket$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(new LoadBasketEligibleShippingMethods())),
      switchMap(() => this.store.pipe(select(getBasketEligibleShippingMethods)))
    );
  }

  // PAYMENT
  eligiblePaymentMethods$() {
    return this.basket$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(new LoadBasketEligiblePaymentMethods())),
      switchMap(() => this.store.pipe(select(getBasketEligiblePaymentMethods)))
    );
  }

  setBasketPayment(paymentName: string) {
    this.store.dispatch(new SetBasketPayment({ id: paymentName }));
  }

  createBasketPayment(paymentInstrument: PaymentInstrument) {
    this.store.dispatch(new CreateBasketPayment({ paymentInstrument }));
  }

  deleteBasketPayment(paymentInstrumentId: string) {
    this.store.dispatch(new DeleteBasketPayment({ id: paymentInstrumentId }));
  }

  // ADDRESSES
  assignBasketAddress(body: { addressId: string; scope: 'invoice' | 'shipping' | 'any' }) {
    this.store.dispatch(new AssignBasketAddress({ addressId: body.addressId, scope: body.scope }));
  }

  createBasketAddress(body: { address: Address; scope: 'invoice' | 'shipping' | 'any' }) {
    if (!body || !body.address || !body.scope) {
      return;
    }

    this.store.dispatch(new CreateBasketAddress({ address: body.address, scope: body.scope }));
  }

  updateBasketAddress(address: Address) {
    this.store.dispatch(new UpdateBasketAddress({ address }));
  }

  deleteBasketAddress(addressId: string) {
    this.store.dispatch(new DeleteBasketShippingAddress({ addressId }));
  }

  // PROMOTIONS
  promotionError$ = this.store.pipe(select(getBasketPromotionError));

  addPromotionCodeToBasket(code: string) {
    this.store.dispatch(new AddPromotionCodeToBasket({ code }));
  }
}
