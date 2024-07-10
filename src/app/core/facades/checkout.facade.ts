import { Injectable } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { formatISO } from 'date-fns';
import { Subject, combineLatest, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, sample, switchMap, take, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';
import { CustomFields } from 'ish-core/models/custom-field/custom-field.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { selectRouteData } from 'ish-core/store/core/router';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import {
  addMessageToMerchant,
  addPromotionCodeToBasket,
  assignBasketAddress,
  continueCheckout,
  createBasket,
  createBasketAddress,
  createBasketPayment,
  deleteBasketAttribute,
  deleteBasketItem,
  deleteBasketItems,
  deleteBasketPayment,
  deleteBasketShippingAddress,
  getBasketEligibleAddresses,
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
  getSubmittedBasket,
  isBasketInvoiceAndShippingAddressEqual,
  loadBasketEligibleAddresses,
  loadBasketEligiblePaymentMethods,
  loadBasketEligibleShippingMethods,
  loadBasketWithId,
  removePromotionCodeFromBasket,
  setBasketAttribute,
  setBasketCustomFields,
  setBasketDesiredDeliveryDate,
  setBasketPayment,
  startCheckout,
  submitOrder,
  updateBasket,
  updateBasketAddress,
  updateBasketCostCenter,
  updateBasketItem,
  updateBasketShippingMethod,
  updateConcardisCvcLastUpdated,
} from 'ish-core/store/customer/basket';
import { getOrdersError, getSelectedOrder } from 'ish-core/store/customer/orders';
import { getLoggedInUser, getUserCostCenters, loadUserCostCenters } from 'ish-core/store/customer/user';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  private basketChangeInternal$ = new Subject<void>();

  constructor(private store: Store) {
    if (!SSR) {
      this.store
        .pipe(
          select(getBasketLastTimeProductAdded),
          whenTruthy(),
          sample(this.basketLoading$.pipe(debounceTime(500), whenFalsy()))
        )
        .subscribe(() => this.basketChangeInternal$.next());
    }
  }

  checkoutStep$ = this.store.pipe(select(selectRouteData<number>('checkoutStep')));

  start() {
    this.store.dispatch(startCheckout());
  }

  submitOrder() {
    this.store.dispatch(submitOrder());
  }

  continue(targetStep: CheckoutStepType) {
    this.store.dispatch(continueCheckout({ targetStep }));
  }

  // BASKET

  basket$ = this.store.pipe(select(getCurrentBasket));
  basketChange$ = this.basketChangeInternal$.asObservable();
  basketError$ = this.store.pipe(select(getBasketError));
  basketInfo$ = this.store.pipe(select(getBasketInfo));
  basketLoading$ = this.store.pipe(select(getBasketLoading));
  basketValidationResults$ = this.store.pipe(select(getBasketValidationResults));
  basketItemCount$ = this.basket$.pipe(map(basket => basket?.totalProductQuantity || 0));
  basketItemTotal$ = this.basket$.pipe(map(basket => basket?.totals?.itemTotal));
  basketLineItems$ = this.basket$.pipe(map(basket => (basket?.lineItems?.length ? basket.lineItems : undefined)));
  submittedBasket$ = this.store.pipe(select(getSubmittedBasket));
  basketMaxItemQuantity$ = this.store.pipe(
    select(getServerConfigParameter<number>('basket.maxItemQuantity')),
    map(qty => qty || 100)
  );

  loadBasketWithId(basketId: string) {
    this.store.dispatch(loadBasketWithId({ basketId }));
  }

  createBasket() {
    this.store.dispatch(createBasket());
  }

  deleteBasketItem(itemId: string) {
    this.store.dispatch(deleteBasketItem({ itemId }));
  }

  deleteBasketItems() {
    this.store.dispatch(deleteBasketItems());
  }

  updateBasketItem(update: LineItemUpdate) {
    if (update.quantity === 0) {
      this.store.dispatch(deleteBasketItem({ itemId: update.itemId }));
    } else {
      this.store.dispatch(updateBasketItem({ lineItemUpdate: update }));
    }
  }

  updateBasketItemWarranty(itemId: string, warrantySku: string) {
    this.store.dispatch(updateBasketItem({ lineItemUpdate: { itemId, warrantySku } }));
  }

  updateBasketShippingMethod(shippingId: string) {
    this.store.dispatch(updateBasketShippingMethod({ shippingId }));
  }

  updateBasketCostCenter(costCenter: string) {
    this.store.dispatch(updateBasketCostCenter({ costCenter }));
  }

  updateBasketExternalOrderReference(externalOrderReference: string) {
    this.store.dispatch(updateBasket({ update: { externalOrderReference } }));
  }

  setBasketCustomAttribute(attribute: Attribute): void {
    this.store.dispatch(setBasketAttribute({ attribute }));
  }

  deleteBasketCustomAttribute(attributeName: string): void {
    this.store.dispatch(deleteBasketAttribute({ attributeName }));
  }

  setBasketMessageToMerchant(messageToMerchant: string) {
    // eslint-disable-next-line unicorn/no-null
    this.store.dispatch(addMessageToMerchant({ messageToMerchant: messageToMerchant || null }));
  }

  setBasketCustomFields(customFields: CustomFields) {
    this.store.dispatch(setBasketCustomFields({ customFields }));
  }

  // ORDERS

  private ordersError$ = this.store.pipe(select(getOrdersError));
  basketOrOrdersError$ = merge(this.basketError$, this.ordersError$);
  selectedOrder$ = this.store.pipe(select(getSelectedOrder));

  // SHIPPING

  isDesiredDeliveryDateEnabled$ = this.store.pipe(
    select(getServerConfigParameter<boolean>('shipping.desiredDeliveryDate'))
  );

  isDesiredDeliveryExcludeSaturday$ = this.store.pipe(
    select(getServerConfigParameter<boolean>('shipping.deliveryExcludeSaturday'))
  );

  isDesiredDeliveryExcludeSunday$ = this.store.pipe(
    select(getServerConfigParameter<boolean>('shipping.deliveryExcludeSunday'))
  );

  desiredDeliveryDaysMax$ = this.store.pipe(
    select(getServerConfigParameter<number>('shipping.desiredDeliveryDaysMax'))
  );

  desiredDeliveryDaysMin$ = this.store.pipe(
    select(getServerConfigParameter<number>('shipping.desiredDeliveryDaysMin'))
  );

  setDesiredDeliveryDate(date: Date) {
    this.store.dispatch(
      setBasketDesiredDeliveryDate({ desiredDeliveryDate: date ? formatISO(date, { representation: 'date' }) : '' })
    );
  }

  eligibleShippingMethods$() {
    return this.basket$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadBasketEligibleShippingMethods())),
      switchMap(() => this.store.pipe(select(getBasketEligibleShippingMethods)))
    );
  }
  eligibleShippingMethodsNoFetch$ = this.store.pipe(select(getBasketEligibleShippingMethods));

  shippingMethod$(id: string) {
    return this.eligibleShippingMethodsNoFetch$.pipe(
      map(methods => (methods?.length ? methods.find(method => method.id === id) : undefined))
    );
  }

  getValidShippingMethod$() {
    return combineLatest([
      this.basket$.pipe(whenTruthy()),
      this.eligibleShippingMethodsNoFetch$.pipe(whenTruthy()),
    ]).pipe(
      // compare baskets only by shippingMethod
      distinctUntilChanged(
        // spell-checker: words prevbasket prevship curbasket curship
        ([prevbasket, prevship], [curbasket, curship]) =>
          prevbasket.commonShippingMethod?.id === curbasket.commonShippingMethod?.id && prevship === curship
      ),
      map(([basket, shippingMethods]) => {
        // if the basket has a  shipping method and it's valid, do nothing
        if (shippingMethods.find(method => method.id === basket.commonShippingMethod?.id)) {
          return basket.commonShippingMethod.id;
        }
        // if there is no shipping method at basket or this basket shipping method is not valid anymore select automatically the 1st valid shipping method
        if (
          shippingMethods?.length &&
          (!basket?.commonShippingMethod?.id ||
            !shippingMethods.find(method => method.id === basket.commonShippingMethod?.id ?? ''))
        ) {
          return shippingMethods[0].id;
        }
      }),
      whenTruthy(),
      distinctUntilChanged()
    );
  }

  // COST CENTER

  eligibleCostCenterSelectOptions$(selectRole?: string) {
    this.store.dispatch(loadUserCostCenters());
    return this.store.pipe(
      select(getUserCostCenters),
      whenTruthy(),
      map(costCenters =>
        costCenters
          .filter(costCenter => costCenter.roles.includes(selectRole ? selectRole : 'Buyer'))
          .map(c => ({ label: `${c.id} ${c.name}`, value: c.id }))
      )
    );
  }

  // PAYMENT

  eligiblePaymentMethods$() {
    return this.basket$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadBasketEligiblePaymentMethods())),
      switchMap(() => this.store.pipe(select(getBasketEligiblePaymentMethods)))
    );
  }
  priceType$ = this.store.pipe(select(getServerConfigParameter<'gross' | 'net'>('pricing.priceType')));

  setBasketPayment(paymentName: string) {
    this.store.dispatch(setBasketPayment({ id: paymentName }));
  }

  createBasketPayment(paymentInstrument: PaymentInstrument, saveForLater = false) {
    this.store.dispatch(createBasketPayment({ paymentInstrument, saveForLater }));
  }

  deleteBasketPayment(paymentInstrument: PaymentInstrument) {
    this.store.dispatch(deleteBasketPayment({ paymentInstrument }));
  }

  // ADDRESSES

  basketInvoiceAddress$ = this.store.pipe(select(getBasketInvoiceAddress));
  basketShippingAddress$ = this.store.pipe(select(getBasketShippingAddress));
  basketInvoiceAndShippingAddressEqual$ = this.store.pipe(select(isBasketInvoiceAndShippingAddressEqual));
  basketShippingAddressDeletable$ = this.store.pipe(
    select(
      createSelector(
        getLoggedInUser,
        getBasketEligibleAddresses,
        getBasketShippingAddress,
        (user, addresses, shippingAddress): boolean =>
          !!shippingAddress &&
          !!user &&
          addresses?.length > 1 &&
          (!user.preferredInvoiceToAddressUrn || user.preferredInvoiceToAddressUrn !== shippingAddress.urn) &&
          (!user.preferredShipToAddressUrn || user.preferredShipToAddressUrn !== shippingAddress.urn)
      )
    )
  );

  eligibleAddresses$() {
    return this.basket$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadBasketEligibleAddresses())),
      switchMap(() => this.store.pipe(select(getBasketEligibleAddresses)))
    );
  }

  assignBasketAddress(addressId: string, scope: 'invoice' | 'shipping' | 'any') {
    this.store.dispatch(assignBasketAddress({ addressId, scope }));
  }

  createBasketAddress(address: Address, scope: 'invoice' | 'shipping' | 'any') {
    if (!address || !scope) {
      return;
    }

    this.store.dispatch(createBasketAddress({ address, scope }));
  }

  updateBasketAddress(address: Address) {
    this.store.dispatch(updateBasketAddress({ address }));
  }

  deleteBasketAddress(addressId: string) {
    this.store.dispatch(deleteBasketShippingAddress({ addressId }));
  }

  // PROMOTIONS

  promotionError$ = this.store.pipe(select(getBasketPromotionError));

  addPromotionCodeToBasket(code: string) {
    this.store.dispatch(addPromotionCodeToBasket({ code }));
  }

  removePromotionCodeFromBasket(code: string) {
    this.store.dispatch(removePromotionCodeFromBasket({ code }));
  }

  updateConcardisCvcLastUpdated(paymentInstrument: PaymentInstrument) {
    this.store.dispatch(updateConcardisCvcLastUpdated({ paymentInstrument }));
  }
}
