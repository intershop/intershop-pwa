import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat, forkJoin, of } from 'rxjs';
import {
  concatMap,
  concatMapTo,
  defaultIfEmpty,
  filter,
  last,
  map,
  mapTo,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';
import { AddressService } from '../../../services/address/address.service';
import { BasketService } from '../../../services/basket/basket.service';
import { OrderService } from '../../../services/order/order.service';
import { LoadProduct, getProductEntities } from '../../shopping/products';
import { UserActionTypes } from '../../user';
import {
  CreateCustomerAddressFail,
  DeleteCustomerAddressFail,
  DeleteCustomerAddressSuccess,
  UpdateCustomerAddressFail,
  UpdateCustomerAddressSuccess,
} from '../addresses/addresses.actions';

import * as basketActions from './basket.actions';
import { getCurrentBasket } from './basket.selectors';

@Injectable()
export class BasketEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private basketService: BasketService,
    private orderService: OrderService,
    private addressService: AddressService,
    private router: Router
  ) {}

  /**
   * The load basket effect.
   */
  @Effect()
  loadBasket$ = this.actions$.pipe(
    ofType<basketActions.LoadBasket>(basketActions.BasketActionTypes.LoadBasket),
    mapToPayloadProperty('id'),
    mergeMap(id =>
      this.basketService.getBasket(id).pipe(
        map(basket => new basketActions.LoadBasketSuccess({ basket })),
        mapErrorToAction(basketActions.LoadBasketFail)
      )
    )
  );

  /**
   * After successfully loading the basket, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForBasket$ = this.actions$.pipe(
    ofType<basketActions.LoadBasketSuccess>(basketActions.BasketActionTypes.LoadBasketSuccess),
    mapToPayloadProperty('basket'),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    switchMap(([basket, products]) => [
      ...basket.lineItems
        .map(basketItem => basketItem.productSKU)
        .filter(sku => !products[sku])
        .map(sku => new LoadProduct({ sku })),
    ])
  );

  /**
   * Creates a new customer invoice/shipping address which is assigned to the basket later on
   */
  @Effect()
  createCustomerAddressForBasket$ = this.actions$.pipe(
    ofType<basketActions.CreateBasketInvoiceAddress | basketActions.CreateBasketShippingAddress>(
      basketActions.BasketActionTypes.CreateBasketInvoiceAddress,
      basketActions.BasketActionTypes.CreateBasketShippingAddress
    ),

    mergeMap(action =>
      this.addressService.createCustomerAddress('-', action.payload.address).pipe(
        map(newAddress => {
          if (action.type === basketActions.BasketActionTypes.CreateBasketInvoiceAddress) {
            return new basketActions.CreateBasketInvoiceAddressSuccess({ address: newAddress });
          } else {
            return new basketActions.CreateBasketShippingAddressSuccess({ address: newAddress });
          }
        }),
        mapErrorToAction(CreateCustomerAddressFail)
      )
    )
  );

  /**
   * Updates the basket invoice/shipping address with an address that is just created
   */
  @Effect()
  updateBasketWithNewAddress$ = this.actions$.pipe(
    ofType<basketActions.CreateBasketInvoiceAddressSuccess | basketActions.CreateBasketShippingAddressSuccess>(
      basketActions.BasketActionTypes.CreateBasketInvoiceAddressSuccess,
      basketActions.BasketActionTypes.CreateBasketShippingAddressSuccess
    ),
    map(action => {
      if (action.type === basketActions.BasketActionTypes.CreateBasketInvoiceAddressSuccess) {
        return new basketActions.UpdateBasketInvoiceAddress({
          addressId: action.payload.address.id,
        });
      } else {
        return new basketActions.UpdateBasketShippingAddress({
          addressId: action.payload.address.id,
        });
      }
    })
  );

  /**
   * Updates the invoice address of the basket.
   * Triggers the internal UpdateBasket action that handles the actual updating operation.
   */
  @Effect()
  updateBasketInvoiceAddress$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketInvoiceAddress>(basketActions.BasketActionTypes.UpdateBasketInvoiceAddress),
    mapToPayloadProperty('addressId'),
    map(invoiceToAddress => new basketActions.UpdateBasket({ update: { invoiceToAddress } }))
  );

  /**
   * Updates the common shipping address of the basket.
   * Triggers the internal UpdateBasket action that handles the actual updating operation.
   */
  @Effect()
  updateBasketShippingAddress$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketShippingAddress>(basketActions.BasketActionTypes.UpdateBasketShippingAddress),
    mapToPayloadProperty('addressId'),
    map(commonShipToAddress => new basketActions.UpdateBasket({ update: { commonShipToAddress } }))
  );

  /**
   * Updates the common shipping method of the basket.
   * Works currently only if the basket has one bucket
   */
  @Effect()
  updateBasketShippingMethod$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketShippingMethod>(basketActions.BasketActionTypes.UpdateBasketShippingMethod),
    mapToPayloadProperty('shippingId'),
    map(commonShippingMethod => new basketActions.UpdateBasket({ update: { commonShippingMethod } }))
  );

  /**
   * Update basket effect.
   */
  @Effect()
  updateBasket$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasket>(basketActions.BasketActionTypes.UpdateBasket),
    mapToPayloadProperty('update'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([update, basket]) =>
      this.basketService.updateBasket(basket.id, update).pipe(
        mapTo(new basketActions.UpdateBasketSuccess()),
        mapErrorToAction(basketActions.UpdateBasketFail)
      )
    )
  );

  /**
   * Updates a basket customer address (invoice or shipping) and reloads the basket in case of success.
   */
  @Effect()
  updateBasketCustomerAddress$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketCustomerAddress>(basketActions.BasketActionTypes.UpdateBasketCustomerAddress),
    mapToPayloadProperty('address'),
    mergeMap(address =>
      this.addressService.updateCustomerAddress('-', address).pipe(
        concatMapTo([new UpdateCustomerAddressSuccess({ address }), new basketActions.LoadBasket()]),
        mapErrorToAction(UpdateCustomerAddressFail)
      )
    )
  );

  /**
   * Deletes a basket shipping address and reloads the basket in case of success.
   */
  @Effect()
  deleteBasketShippingAddress$ = this.actions$.pipe(
    ofType<basketActions.DeleteBasketShippingAddress>(basketActions.BasketActionTypes.DeleteBasketShippingAddress),
    mapToPayloadProperty('addressId'),
    mergeMap(addressId =>
      this.addressService.deleteCustomerAddress('-', addressId).pipe(
        concatMapTo([new DeleteCustomerAddressSuccess({ addressId }), new basketActions.LoadBasket()]),
        mapErrorToAction(DeleteCustomerAddressFail)
      )
    )
  );

  /**
   * Add a product to the current basket.
   * Triggers the internal AddItemsToBasket action that handles the actual adding of the product to the basket.
   */
  @Effect()
  addProductToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddProductToBasket>(basketActions.BasketActionTypes.AddProductToBasket),
    mapToPayload(),
    map(item => new basketActions.AddItemsToBasket({ items: [item] }))
  );

  /**
   * Add items to the current basket.
   * Only triggers if basket is set or action payload contains basketId.
   */
  @Effect()
  addItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([{ basketId }, basket]) => !!basket || !!basketId),
    concatMap(([payload, basket]) => {
      // get basket id from AddItemsToBasket action if set, otherwise use current basket id
      const basketId = payload.basketId || basket.id;

      return this.basketService.addItemsToBasket(basketId, payload.items).pipe(
        mapTo(new basketActions.AddItemsToBasketSuccess()),
        mapErrorToAction(basketActions.AddItemsToBasketFail)
      );
    })
  );

  /**
   * Add quote to the current basket.
   * Only triggers if the user has a basket.
   */
  @Effect()
  addQuoteToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddQuoteToBasket>(basketActions.BasketActionTypes.AddQuoteToBasket),
    mapToPayloadProperty('quoteId'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([, basket]) => !!basket && !!basket.id),
    concatMap(([quoteId, basket]) =>
      this.basketService.addQuoteToBasket(quoteId, basket.id).pipe(
        map(link => new basketActions.AddQuoteToBasketSuccess({ link })),
        mapErrorToAction(basketActions.AddQuoteToBasketFail)
      )
    )
  );

  /**
   * Get current basket if missing and call AddQuoteToBasketAction
   * Only triggers if the user has not yet a basket
   */
  @Effect()
  getBasketBeforeAddQuoteToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddQuoteToBasket>(basketActions.BasketActionTypes.AddQuoteToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([, basket]) => !basket || !basket.id),
    mergeMap(([payload]) => forkJoin(of(payload), this.basketService.createBasket())),
    map(([payload]) => new basketActions.AddQuoteToBasket(payload))
  );

  /**
   * Update basket items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   */
  @Effect()
  updateBasketItems$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketItems>(basketActions.BasketActionTypes.UpdateBasketItems),
    mapToPayloadProperty('lineItemQuantities'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    map(([items, basket]) => {
      const basketItems = basket.lineItems;
      const updatedItems = [];
      if (basketItems) {
        for (const basketItem of basketItems) {
          for (const item of items) {
            if (basketItem.id === item.itemId && basketItem.quantity.value !== item.quantity) {
              updatedItems.push(item);
            }
          }
        }
      }
      return { updatedItems, basket };
    }),

    concatMap(({ updatedItems, basket }) =>
      concat(
        ...updatedItems.map(item => {
          if (item.quantity > 0) {
            return this.basketService.updateBasketItem(basket.id, item.itemId, {
              quantity: {
                value: item.quantity,
              },
            });
          }
          return this.basketService.deleteBasketItem(basket.id, item.itemId);
        })
      ).pipe(
        defaultIfEmpty(),
        last(),
        mapTo(new basketActions.UpdateBasketItemsSuccess()),
        mapErrorToAction(basketActions.UpdateBasketItemsFail)
      )
    )
  );

  /**
   * Delete basket item effect.
   */
  @Effect()
  deleteBasketItem$ = this.actions$.pipe(
    ofType<basketActions.DeleteBasketItem>(basketActions.BasketActionTypes.DeleteBasketItem),
    mapToPayloadProperty('itemId'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([itemId, basket]) =>
      this.basketService.deleteBasketItem(basket.id, itemId).pipe(
        mapTo(new basketActions.DeleteBasketItemSuccess()),
        mapErrorToAction(basketActions.DeleteBasketItemFail)
      )
    )
  );

  /**
   * The load basket eligible shipping methods effect.
   */
  @Effect()
  loadBasketEligibleShippingMethods$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketEligibleShippingMethods),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([, basket]) =>
      this.basketService.getBasketEligibleShippingMethods(basket.id).pipe(
        map(result => new basketActions.LoadBasketEligibleShippingMethodsSuccess({ shippingMethods: result })),
        mapErrorToAction(basketActions.LoadBasketEligibleShippingMethodsFail)
      )
    )
  );

  /**
   * The load basket eligible payment methods effect.
   */
  @Effect()
  loadBasketEligiblePaymentMethods$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketEligiblePaymentMethods),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([, basket]) =>
      this.basketService.getBasketPaymentOptions(basket.id).pipe(
        map(result => new basketActions.LoadBasketEligiblePaymentMethodsSuccess({ paymentMethods: result })),
        mapErrorToAction(basketActions.LoadBasketEligiblePaymentMethodsFail)
      )
    )
  );

  /**
   * The load basket payments effect.
   */
  @Effect()
  loadBasketPayments$ = this.actions$.pipe(
    ofType<basketActions.LoadBasketPayments>(basketActions.BasketActionTypes.LoadBasketPayments),
    mapToPayloadProperty('id'),
    mergeMap(basketId =>
      this.basketService.getBasketPayments(basketId).pipe(
        map(basketPayments => new basketActions.LoadBasketPaymentsSuccess({ paymentMethods: basketPayments })),
        mapErrorToAction(basketActions.LoadBasketPaymentsFail)
      )
    )
  );

  /**
   * Trigger a LoadBasketPayments action after a successful basket loading.
   */
  @Effect()
  loadBasketPaymentsAfterBasketLoad$ = this.actions$.pipe(
    ofType<basketActions.LoadBasketSuccess>(basketActions.BasketActionTypes.LoadBasketSuccess),
    mapToPayloadProperty('basket'),
    map(basket => new basketActions.LoadBasketPayments({ id: basket.id }))
  );

  /**
   * Sets a payment at the current basket.
   */
  @Effect()
  setPaymentAtBasket$ = this.actions$.pipe(
    ofType<basketActions.SetBasketPayment>(basketActions.BasketActionTypes.SetBasketPayment),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([paymentName, basket]) => {
      const addPayment$ = this.basketService.addBasketPayment(basket.id, paymentName);
      return (basket.payment
        ? this.basketService.deleteBasketPayment(basket.id, basket.payment.id).pipe(concatMap(() => addPayment$))
        : addPayment$
      ).pipe(
        mapTo(new basketActions.SetBasketPaymentSuccess()),
        mapErrorToAction(basketActions.SetBasketPaymentFail)
      );
    })
  );

  /**
   * Get current basket if missing and call AddItemsToBasketAction
   * Only triggers if basket is unset set and action payload does not contain basketId.
   */
  @Effect()
  getBasketBeforeAddItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([payload, basket]) => !basket && !payload.basketId),
    mergeMap(([payload]) => forkJoin(of(payload), this.basketService.createBasket())),
    map(([payload, newBasket]) => new basketActions.AddItemsToBasket({ items: payload.items, basketId: newBasket.id }))
  );

  /**
   * Trigger an AddItemsToBasket action after LoginUserSuccess, if basket items are present from pre login state.
   */
  @Effect()
  mergeBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([, currentBasket]) => currentBasket && currentBasket.lineItems && currentBasket.lineItems.length > 0),
    switchMap(() => this.basketService.getBaskets()),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    map(([newBaskets, currentBasket]) => {
      const items = currentBasket.lineItems.map(lineItem => ({
        sku: lineItem.productSKU,
        quantity: lineItem.quantity.value,
      }));

      return new basketActions.AddItemsToBasket({ items, basketId: newBaskets.length ? newBaskets[0].id : undefined });
    })
  );

  /**
   * Trigger LoadBasket action after LoginUserSucces, if no pre login state basket items are present.
   */
  @Effect()
  loadBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() => this.basketService.getBaskets()) /* prevent 404 error by checking on existing basket */,
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(
      ([newBaskets, currentBasket]) =>
        (!currentBasket || !currentBasket.lineItems || currentBasket.lineItems.length === 0) && newBaskets.length > 0
    ),
    mapTo(new basketActions.LoadBasket())
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  @Effect()
  loadBasketAfterBasketChangeSuccess$ = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.UpdateBasketSuccess,
      basketActions.BasketActionTypes.AddItemsToBasketSuccess,
      basketActions.BasketActionTypes.UpdateBasketItemsSuccess,
      basketActions.BasketActionTypes.DeleteBasketItemSuccess
    ),
    mapTo(new basketActions.LoadBasket())
  );

  /**
   * Triggers a Caluculate Basket action after adding a quote to basket.
   * ToDo: This is only necessary as long as api v0 is used for addQuote and addPayment
   */
  @Effect()
  calculateBasketAfterAddToQuote = this.actions$.pipe(
    ofType(
      basketActions.BasketActionTypes.AddQuoteToBasketSuccess,
      basketActions.BasketActionTypes.AddQuoteToBasketFail,
      basketActions.BasketActionTypes.SetBasketPaymentSuccess,
      basketActions.BasketActionTypes.SetBasketPaymentFail
    ),
    mapTo(new basketActions.UpdateBasket({ update: { calculationState: 'CALCULATED' } }))
  );

  /**
   * Trigger ResetBasket action after LogoutUser.
   */
  @Effect()
  resetBasketAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),

    mapTo(new basketActions.ResetBasket())
  );

  /**
   * Creates an order based on the given basket.
   */
  @Effect()
  createOrder$ = this.actions$.pipe(
    ofType<basketActions.CreateOrder>(basketActions.BasketActionTypes.CreateOrder),
    mapToPayloadProperty('basket'),
    mergeMap(basket =>
      this.orderService.createOrder(basket, true).pipe(
        map(order => new basketActions.CreateOrderSuccess({ order })),
        mapErrorToAction(basketActions.CreateOrderFail)
      )
    )
  );

  @Effect({ dispatch: false })
  goToCheckoutReceiptPageAfterOrderCreation$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.CreateOrderSuccess),
    tap(() => this.router.navigate(['/checkout/receipt']))
  );
}
