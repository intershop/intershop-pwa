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

import { OrderService } from '../../../account/services/order/order.service';
import { UserActionTypes } from '../../../core/store/user/user.actions';
import { Basket } from '../../../models/basket/basket.model';
import { LoadProduct, getProductEntities } from '../../../shopping/store/products';
import { mapErrorToAction } from '../../../utils/operators';
import { AddressService } from '../../services/address/address.service';
import { BasketService } from '../../services/basket/basket.service';
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
    map(action => action.payload),
    mergeMap(basketId =>
      this.basketService.getBasket(basketId).pipe(
        map(basket => new basketActions.LoadBasketSuccess(basket)),
        mapErrorToAction(basketActions.LoadBasketFail)
      )
    )
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
      this.addressService.createCustomerAddress('-', action.payload).pipe(
        map(newAddress => {
          if (action.type === basketActions.BasketActionTypes.CreateBasketInvoiceAddress) {
            return new basketActions.CreateBasketInvoiceAddressSuccess(newAddress);
          } else {
            return new basketActions.CreateBasketShippingAddressSuccess(newAddress);
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
        return new basketActions.UpdateBasketInvoiceAddress(action.payload.id);
      } else {
        return new basketActions.UpdateBasketShippingAddress(action.payload.id);
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
    map(
      action =>
        new basketActions.UpdateBasket({
          invoiceToAddress: { id: action.payload },
        })
    )
  );

  /**
   * Updates the common shipping address of the basket.
   * Triggers the internal UpdateBasket action that handles the actual updating operation.
   */
  @Effect()
  updateBasketShippingAddress$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketShippingAddress>(basketActions.BasketActionTypes.UpdateBasketShippingAddress),
    map(
      action =>
        new basketActions.UpdateBasket({
          commonShipToAddress: { id: action.payload },
        })
    )
  );

  /**
   * Updates the common shipping method of the basket.
   * Works currently only if multipleShipment flag is set to true !!
   */
  @Effect()
  updateBasketShippingMethod$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketShippingMethod>(basketActions.BasketActionTypes.UpdateBasketShippingMethod),
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([id, basket]) =>
      concat(
        ...basket.lineItems.map(item =>
          this.basketService.updateBasketItem(basket.id, item.id, { shippingMethod: { id } })
        )
      ).pipe(
        last(),
        mapTo(new basketActions.UpdateBasketSuccess()),
        mapErrorToAction(basketActions.UpdateBasketFail)
      )
    )
  );

  /**
   * Update basket effect.
   */
  @Effect()
  updateBasket$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasket>(basketActions.BasketActionTypes.UpdateBasket),
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([payload, basket]) =>
      this.basketService.updateBasket(basket.id, payload).pipe(
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
    map(action => action.payload),
    mergeMap(address =>
      this.addressService.updateCustomerAddress('-', address).pipe(
        concatMapTo([new UpdateCustomerAddressSuccess(address), new basketActions.LoadBasket()]),
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
    map(action => action.payload),
    mergeMap(addressId =>
      this.addressService.deleteCustomerAddress('-', addressId).pipe(
        concatMapTo([new DeleteCustomerAddressSuccess(addressId), new basketActions.LoadBasket()]),
        mapErrorToAction(DeleteCustomerAddressFail)
      )
    )
  );

  /**
   * The load basket items effect.
   */
  @Effect()
  loadBasketItems$ = this.actions$.pipe(
    ofType<basketActions.LoadBasketItems>(basketActions.BasketActionTypes.LoadBasketItems),
    map(action => action.payload),
    mergeMap(basketId =>
      this.basketService.getBasketItems(basketId).pipe(
        map(basketItems => new basketActions.LoadBasketItemsSuccess(basketItems)),
        mapErrorToAction(basketActions.LoadBasketItemsFail)
      )
    )
  );

  /**
   * After successfully loading the basket items, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForBasket$ = this.actions$.pipe(
    ofType<basketActions.LoadBasketItemsSuccess>(basketActions.BasketActionTypes.LoadBasketItemsSuccess),
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    switchMap(([basketItems, products]) => [
      ...basketItems
        .filter(basketItem => !products[basketItem.productSKU])
        .map(basketItem => new LoadProduct(basketItem.productSKU)),
    ])
  );

  /**
   * Add a product to the current basket.
   * Triggers the internal AddItemsToBasket action that handles the actual adding of the product to the basket.
   */
  @Effect()
  addProductToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddProductToBasket>(basketActions.BasketActionTypes.AddProductToBasket),
    map(action => new basketActions.AddItemsToBasket({ items: [action.payload] }))
  );

  /**
   * Add items to the current basket.
   * Only triggers if basket is set or action payload contains basketId.
   */
  @Effect()
  addItemsToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddItemsToBasket>(basketActions.BasketActionTypes.AddItemsToBasket),
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([payload, basket]) => !!basket || !!payload.basketId),
    concatMap(([payload, basket]) => {
      // get basket id from AddItemsToBasket action if set, otherwise use current basket id
      const basketId = payload.basketId || basket.id;

      return this.basketService.addItemsToBasket(payload.items, basketId).pipe(
        mapTo(new basketActions.AddItemsToBasketSuccess()),
        mapErrorToAction(basketActions.AddItemsToBasketFail)
      );
    })
  );

  /**
   * Add quote to the current basket.
   * Only triggers if basket is set.
   */
  @Effect()
  addQuoteToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddQuoteToBasket>(basketActions.BasketActionTypes.AddQuoteToBasket),
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([quoteId, basket]) =>
      this.basketService.addQuoteToBasket(quoteId, basket.id).pipe(
        map(link => new basketActions.AddQuoteToBasketSuccess(link)),
        mapErrorToAction(basketActions.AddQuoteToBasketFail)
      )
    )
  );

  /**
   * Update basket items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   */
  @Effect()
  updateBasketItems$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasketItems>(basketActions.BasketActionTypes.UpdateBasketItems),
    map(action => action.payload),
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
          return this.basketService.deleteBasketItem(item.itemId, basket.id);
        })
      ).pipe(
        defaultIfEmpty(undefined),
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
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([itemId, basket]) =>
      this.basketService.deleteBasketItem(itemId, basket.id).pipe(
        mapTo(new basketActions.DeleteBasketItemSuccess()),
        mapErrorToAction(basketActions.DeleteBasketItemFail)
      )
    )
  );

  /**
   * Trigger a LoadBasketItems action after a successful basket loading.
   */
  @Effect()
  loadBasketItemsAfterBasketLoad$ = this.actions$.pipe(
    ofType<basketActions.LoadBasketSuccess>(basketActions.BasketActionTypes.LoadBasketSuccess),
    map(action => action.payload),
    map(basket => new basketActions.LoadBasketItems(basket.id))
  );

  /**
   * The load basket eligible shipping methods effect.
   */
  @Effect()
  loadBasketEligibleShippingMethods$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketEligibleShippingMethods),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([, basket]) =>
      /* simplified solution: get eligible shipping methods only for the first item
       ToDo: differentiate between multi and single shipment */
      this.basketService.getBasketItemOptions(basket.id, basket.lineItems[0].id).pipe(
        map(
          result =>
            new basketActions.LoadBasketEligibleShippingMethodsSuccess(result.eligibleShippingMethods.shippingMethods)
        ),
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
        map(result => new basketActions.LoadBasketEligiblePaymentMethodsSuccess(result)),
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
    map(action => action.payload),
    mergeMap(basketId =>
      this.basketService.getBasketPayments(basketId).pipe(
        map(basketPayments => new basketActions.LoadBasketPaymentsSuccess(basketPayments)),
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
    map(action => action.payload),
    map(basket => new basketActions.LoadBasketPayments(basket.id))
  );

  /**
   * Sets a payment at the current basket.
   */
  @Effect()
  setPaymentAtBasket$ = this.actions$.pipe(
    ofType<basketActions.SetBasketPayment>(basketActions.BasketActionTypes.SetBasketPayment),
    map((action: basketActions.SetBasketPayment) => action.payload),
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
    map((action: basketActions.AddItemsToBasket) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([payload, basket]) => !basket && !payload.basketId),
    // TODO: add create basket if LoadBasket does not create basket anymore
    mergeMap(([payload]) => forkJoin(of(payload), this.basketService.getBasket())),
    map(([payload, newBasket]) => new basketActions.AddItemsToBasket({ items: payload.items, basketId: newBasket.id }))
  );

  /**
   * Trigger an AddItemsToBasket action after LoginUserSuccess, if basket items are present from pre login state.
   */
  @Effect()
  mergeBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() => this.basketService.getBasket()),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([, currentBasket]) => currentBasket && currentBasket.lineItems && currentBasket.lineItems.length > 0),
    map(([newBasket, currentBasket]) => {
      const items = currentBasket.lineItems.map(lineItem => ({
        sku: lineItem.productSKU,
        quantity: lineItem.quantity.value,
      }));

      return new basketActions.AddItemsToBasket({ items, basketId: newBasket.id });
    })
  );

  /**
   * Trigger LoadBasket action after LoginUserSucces, if no pre login state basket items are present.
   */
  @Effect()
  loadBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() => this.basketService.getBasket()),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    filter(([, currentBasket]) => !currentBasket || !currentBasket.lineItems || currentBasket.lineItems.length === 0),
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
      basketActions.BasketActionTypes.AddQuoteToBasketSuccess,
      basketActions.BasketActionTypes.UpdateBasketItemsSuccess,
      basketActions.BasketActionTypes.DeleteBasketItemSuccess,
      basketActions.BasketActionTypes.SetBasketPaymentSuccess
    ),
    mapTo(new basketActions.LoadBasket())
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
    map(action => action.payload),
    mergeMap((basket: Basket) =>
      this.orderService.createOrder(basket, true).pipe(
        map(order => new basketActions.CreateOrderSuccess(order)),
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
