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
import { BasketService, BasketUpdateType } from '../../../services/basket/basket.service';
import { OrderService } from '../../../services/order/order.service';
import { LoadProduct, getProductEntities } from '../../shopping/products';
import { UserActionTypes, getLoggedInCustomer } from '../../user';
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
   * Creates a new invoice/shipping address which is assigned to the basket later on
   * if the user is logged in a customer address will be created, otherwise a new basket address will be created
   */
  @Effect()
  createAddressForBasket$ = this.actions$.pipe(
    ofType<basketActions.CreateBasketAddress>(basketActions.BasketActionTypes.CreateBasketAddress),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),

    mergeMap(([action, customer]) => {
      // create address at customer for logged in user
      if (customer) {
        return this.addressService.createCustomerAddress('-', action.payload.address).pipe(
          map(
            newAddress =>
              new basketActions.CreateBasketAddressSuccess({ address: newAddress, scope: action.payload.scope })
          ),
          mapErrorToAction(CreateCustomerAddressFail)
        );
        // create address at basket for anonymous user
      } else {
        return this.basketService.createBasketAddress('current', action.payload.address).pipe(
          map(
            newAddress =>
              new basketActions.CreateBasketAddressSuccess({ address: newAddress, scope: action.payload.scope })
          ),
          mapErrorToAction(CreateCustomerAddressFail)
        );
      }
    })
  );

  /**
   * Assigns an address that has just created as basket invoice/shipping address
   */
  @Effect()
  assignNewAddressToBasket$ = this.actions$.pipe(
    ofType<basketActions.CreateBasketAddressSuccess>(basketActions.BasketActionTypes.CreateBasketAddressSuccess),
    map(
      action =>
        new basketActions.AssignBasketAddress({
          addressId: action.payload.address.id,
          scope: action.payload.scope,
        })
    )
  );

  /**
   * Assigns the address to the basket according to the scope of the payload.
   * Triggers the internal UpdateBasket action that handles the actual updating operation.
   */
  @Effect()
  assignBasketAddress$ = this.actions$.pipe(
    ofType<basketActions.AssignBasketAddress>(basketActions.BasketActionTypes.AssignBasketAddress),
    mapToPayload(),
    map(payload => {
      let body: BasketUpdateType;
      switch (payload.scope) {
        case 'invoice': {
          body = { invoiceToAddress: payload.addressId };
          break;
        }
        case 'shipping': {
          body = { commonShipToAddress: payload.addressId };
          break;
        }
        case 'any': {
          body = { invoiceToAddress: payload.addressId, commonShipToAddress: payload.addressId };
          break;
        }
      }

      return new basketActions.UpdateBasket({ update: body });
    })
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
    concatMap(([update, currentBasket]) =>
      this.basketService.updateBasket(currentBasket.id, update).pipe(
        map(basket => new basketActions.LoadBasketSuccess({ basket })),
        mapErrorToAction(basketActions.UpdateBasketFail)
      )
    )
  );

  /**
   * Updates an address (basket or customer) and reloads the basket in case of success.
   */
  @Effect()
  updateBasketAddress$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketAddress>(basketActions.BasketActionTypes.UpdateBasketAddress),
    mapToPayloadProperty('address'),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    mergeMap(([address, customer]) => {
      // create address at customer for logged in user
      if (customer) {
        return this.addressService.updateCustomerAddress('-', address).pipe(
          concatMapTo([new UpdateCustomerAddressSuccess({ address }), new basketActions.LoadBasket()]),
          mapErrorToAction(UpdateCustomerAddressFail)
        );
        // create address at basket for anonymous user
      } else {
        return this.basketService.updateBasketAddress('current', address).pipe(
          concatMapTo([new UpdateCustomerAddressSuccess({ address }), new basketActions.LoadBasket()]),
          mapErrorToAction(UpdateCustomerAddressFail)
        );
      }
    })
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
    filter(([{ basketId }, currentBasket]) => !!currentBasket || !!basketId),
    concatMap(([payload, currentBasket]) => {
      // get basket id from AddItemsToBasket action if set, otherwise use current basket id
      const basketId = payload.basketId || currentBasket.id;

      return this.basketService.addItemsToBasket(basketId, payload.items).pipe(
        mapTo(new basketActions.AddItemsToBasketSuccess()),
        mapErrorToAction(basketActions.AddItemsToBasketFail)
      );
    })
  );

  /**
   * Creates a basket if missing and call AddItemsToBasketAction
   * Only triggers if basket is unset set and action payload does not contain basketId.
   */
  @Effect()
  createBasketBeforeAddItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([payload, basket]) => !basket && !payload.basketId),
    mergeMap(([payload]) => forkJoin(of(payload), this.basketService.createBasket())),
    map(([payload, newBasket]) => new basketActions.AddItemsToBasket({ items: payload.items, basketId: newBasket.id }))
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
      this.basketService.getBasketEligiblePaymentMethods(basket.id).pipe(
        map(result => new basketActions.LoadBasketEligiblePaymentMethodsSuccess({ paymentMethods: result })),
        mapErrorToAction(basketActions.LoadBasketEligiblePaymentMethodsFail)
      )
    )
  );

  /**
   * Sets a payment at the current basket.
   */
  @Effect()
  setPaymentAtBasket$ = this.actions$.pipe(
    ofType<basketActions.SetBasketPayment>(basketActions.BasketActionTypes.SetBasketPayment),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([paymentInstrument, basket]) =>
      this.basketService.setBasketPayment(basket.id, paymentInstrument).pipe(
        mapTo(new basketActions.SetBasketPaymentSuccess()),
        mapErrorToAction(basketActions.SetBasketPaymentFail)
      )
    )
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
    tap(() => this.store.dispatch(new basketActions.ResetBasket())),
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
      basketActions.BasketActionTypes.AddItemsToBasketSuccess,
      basketActions.BasketActionTypes.UpdateBasketItemsSuccess,
      basketActions.BasketActionTypes.DeleteBasketItemSuccess,
      basketActions.BasketActionTypes.SetBasketPaymentSuccess,
      basketActions.BasketActionTypes.SetBasketPaymentFail
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
      basketActions.BasketActionTypes.AddQuoteToBasketFail
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
