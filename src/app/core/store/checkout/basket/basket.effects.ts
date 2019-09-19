import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ofRoute } from 'ngrx-router';
import {
  concatMap,
  filter,
  map,
  mapTo,
  mergeMap,
  mergeMapTo,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { BasketValidationScopeType } from 'ish-core/models/basket-validation/basket-validation.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { LoadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { UserActionTypes } from 'ish-core/store/user';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import * as basketActions from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<{}>,
    private basketService: BasketService
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

  @Effect()
  loadBasketByAPIToken$ = this.actions$.pipe(
    ofType<basketActions.LoadBasketByAPIToken>(basketActions.BasketActionTypes.LoadBasketByAPIToken),
    mapToPayloadProperty('apiToken'),
    concatMap(apiToken =>
      this.basketService.getBasketByToken(apiToken).pipe(map(basket => new basketActions.LoadBasketSuccess({ basket })))
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
    switchMap(basket => [
      ...basket.lineItems.map(
        ({ productSKU }) => new LoadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
      ),
    ])
  );

  /**
   * The load basket eligible shipping methods effect.
   */
  @Effect()
  loadBasketEligibleShippingMethods$ = this.actions$.pipe(
    ofType(basketActions.BasketActionTypes.LoadBasketEligibleShippingMethods),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([, basketId]) =>
      this.basketService.getBasketEligibleShippingMethods(basketId).pipe(
        map(result => new basketActions.LoadBasketEligibleShippingMethodsSuccess({ shippingMethods: result })),
        mapErrorToAction(basketActions.LoadBasketEligibleShippingMethodsFail)
      )
    )
  );

  /**
   * Update basket effect.
   */
  @Effect()
  updateBasket$ = this.actions$.pipe(
    ofType<basketActions.UpdateBasket>(basketActions.BasketActionTypes.UpdateBasket),
    mapToPayloadProperty('update'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    concatMap(([update, currentBasketId]) =>
      this.basketService.updateBasket(currentBasketId, update).pipe(
        map(basket => new basketActions.LoadBasketSuccess({ basket })),
        mapErrorToAction(basketActions.UpdateBasketFail)
      )
    )
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
   * Add quote to the current basket.
   * Only triggers if the user has a basket.
   */
  @Effect()
  addQuoteToBasket$ = this.actions$.pipe(
    ofType<basketActions.AddQuoteToBasket>(basketActions.BasketActionTypes.AddQuoteToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([payload, currentBasketId]) => !!currentBasketId || !!payload.basketId),
    concatMap(([payload, currentBasketId]) =>
      this.basketService.addQuoteToBasket(payload.quoteId, currentBasketId).pipe(
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
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([payload, basketId]) => !basketId && !payload.basketId),
    mergeMap(([{ quoteId }]) =>
      this.basketService.createBasket().pipe(
        mapToProperty('id'),
        map(id => new basketActions.AddQuoteToBasket({ quoteId, basketId: id as string }))
      )
    )
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
    mapTo(new basketActions.UpdateBasket({ update: { calculated: true } }))
  );

  /**
   * After a user logged in a merge basket action is triggered if there are already items in the anonymous user's basket
   */
  @Effect()
  mergeBasketAfterLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    mergeMapTo(
      this.store.pipe(
        select(getCurrentBasket),
        take(1)
      )
    ),
    filter(currentBasket => currentBasket && currentBasket.lineItems && currentBasket.lineItems.length > 0),
    mapTo(new basketActions.MergeBasket())
  );

  /**
   * Merge anonymous basket into current basket of a registered user.
   * If the user has not yet a basket a new basket is created before the merge
   */
  @Effect()
  mergeBasket$ = this.actions$.pipe(
    ofType<basketActions.MergeBasket>(basketActions.BasketActionTypes.MergeBasket),
    mergeMapTo(
      this.store.pipe(
        select(getCurrentBasket),
        take(1)
      )
    ),
    concatMap(sourceBasket =>
      this.basketService.mergeBasket(sourceBasket.id).pipe(
        map(basket => new basketActions.MergeBasketSuccess({ basket })),
        mapErrorToAction(basketActions.MergeBasketFail)
      )
    )
  );

  /**
   * Validates the basket before the user is allowed to jump to the next basket step
   */
  @Effect()
  validateBasket$ = this.actions$.pipe(
    ofType<basketActions.ContinueCheckout>(basketActions.BasketActionTypes.ContinueCheckout),
    mapToPayloadProperty('targetStep'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    whenTruthy(),
    concatMap(([targetStep, basketId]) => {
      let scopes: BasketValidationScopeType[] = [''];
      let targetRoute = '';
      switch (targetStep) {
        case 1: {
          scopes = ['Products', 'Value'];
          targetRoute = '/checkout/address';
          break;
        }
        case 2: {
          scopes = ['InvoiceAddress', 'ShippingAddress', 'Addresses'];
          targetRoute = '/checkout/shipping';
          break;
        }
        case 3: {
          scopes = ['Shipping'];
          targetRoute = '/checkout/payment';
          break;
        }
        case 4: {
          scopes = ['Payment'];
          targetRoute = '/checkout/review';
          break;
        }
      }
      return this.basketService.validateBasket(basketId, scopes).pipe(
        map(basketValidation => new basketActions.ContinueCheckoutSuccess({ targetRoute, basketValidation })),
        mapErrorToAction(basketActions.ContinueCheckoutFail)
      );
    })
  );

  /**
   * After order creation either redirect to a payment provider or show checkout receipt page.
   */
  @Effect({ dispatch: false })
  jumpToNextCheckoutStep$ = this.actions$.pipe(
    ofType<basketActions.ContinueCheckoutSuccess>(basketActions.BasketActionTypes.ContinueCheckoutSuccess),
    mapToPayload(),
    tap(payload => {
      if (payload.targetRoute && payload.basketValidation && payload.basketValidation.results.valid) {
        this.router.navigate([payload.targetRoute]);
      }
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
   * Trigger ResetBasket action after LogoutUser.
   */
  @Effect()
  resetBasketAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),

    mapTo(new basketActions.ResetBasket())
  );

  /**
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route.
   */
  @Effect()
  routeListenerForResettingBasketErrors$ = this.actions$.pipe(
    ofRoute(/^(basket|checkout.*)/),
    mapTo(new basketActions.ResetBasketErrors())
  );
}
