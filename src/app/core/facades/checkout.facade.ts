import { Injectable } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { merge } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { selectRouteData } from 'ish-core/store/core/router';
import { getAllAddresses } from 'ish-core/store/customer/addresses';
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
  RemovePromotionCodeFromBasket,
  SetBasketPayment,
  UpdateBasketAddress,
  UpdateBasketItems,
  UpdateBasketShippingMethod,
  getBasketEligiblePaymentMethods,
  getBasketEligibleShippingMethods,
  getBasketError,
  getBasketInfo,
  getBasketInvoiceAddress,
  getBasketLastTimeProductAdded,
  getBasketLoading,
  getBasketPromotionError,
  getBasketShippingAddress,
  getBasketValidationResults,
  getCurrentBasket,
  isBasketInvoiceAndShippingAddressEqual,
} from 'ish-core/store/customer/basket';
import { getOrdersError, getSelectedOrder } from 'ish-core/store/customer/orders';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { getServerConfigParameter } from 'ish-core/store/general/server-config';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  constructor(private store: Store) {}

  checkoutStep$ = this.store.pipe(select(selectRouteData<number>('checkoutStep')));

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
  private ordersError$ = this.store.pipe(select(getOrdersError));
  basketOrOrdersError$ = merge(this.basketError$, this.ordersError$);
  selectedOrder$ = this.store.pipe(select(getSelectedOrder));

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
  priceType$ = this.store.pipe(select(getServerConfigParameter<'gross' | 'net'>('pricing.priceType')));

  setBasketPayment(paymentName: string) {
    this.store.dispatch(new SetBasketPayment({ id: paymentName }));
  }

  createBasketPayment(paymentInstrument: PaymentInstrument, saveForLater = false) {
    this.store.dispatch(new CreateBasketPayment({ paymentInstrument, saveForLater }));
  }

  deleteBasketPayment(paymentInstrument: PaymentInstrument) {
    this.store.dispatch(new DeleteBasketPayment({ paymentInstrument }));
  }

  // ADDRESSES
  basketInvoiceAddress$ = this.store.pipe(select(getBasketInvoiceAddress));
  basketShippingAddress$ = this.store.pipe(select(getBasketShippingAddress));
  basketInvoiceAndShippingAddressEqual$ = this.store.pipe(select(isBasketInvoiceAndShippingAddressEqual));
  basketShippingAddressDeletable$ = this.store.pipe(
    select(
      createSelector(
        getLoggedInUser,
        getAllAddresses,
        getBasketShippingAddress,
        (user, addresses, shippingAddress): boolean =>
          !!shippingAddress &&
          !!user &&
          addresses.length > 1 &&
          (!user.preferredInvoiceToAddressUrn || user.preferredInvoiceToAddressUrn !== shippingAddress.urn) &&
          (!user.preferredShipToAddressUrn || user.preferredShipToAddressUrn !== shippingAddress.urn)
      )
    )
  );

  assignBasketAddress(addressId: string, scope: 'invoice' | 'shipping' | 'any') {
    this.store.dispatch(new AssignBasketAddress({ addressId, scope }));
  }

  createBasketAddress(address: Address, scope: 'invoice' | 'shipping' | 'any') {
    if (!address || !scope) {
      return;
    }

    this.store.dispatch(new CreateBasketAddress({ address, scope }));
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

  removePromotionCodeFromBasket(code: string) {
    this.store.dispatch(new RemovePromotionCodeFromBasket({ code }));
  }
}
