import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, mergeMap, mergeMapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { ofUrl, selectQueryParam } from 'ish-core/store/core/router';
import { getLastAPITokenBeforeLogin, loginUserSuccess } from 'ish-core/store/customer/user';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayloadProperty, whenFalsy } from 'ish-core/utils/operators';

import {
  loadBasket,
  loadBasketByAPIToken,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  mergeBasket,
  mergeBasketFail,
  mergeBasketSuccess,
  resetBasketErrors,
  updateBasket,
  updateBasketFail,
  updateBasketShippingMethod,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketEffects {
  constructor(private actions$: Actions, private store: Store, private basketService: BasketService) {}

  /**
   * The load basket effect.
   */
  loadBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasket),
      mergeMap(() =>
        this.basketService.getBasket().pipe(
          map(basket => loadBasketSuccess({ basket })),
          mapErrorToAction(loadBasketFail)
        )
      )
    )
  );

  loadBasketByAPIToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketByAPIToken),
      mapToPayloadProperty('apiToken'),
      concatMap(apiToken =>
        this.basketService.getBasketByToken(apiToken).pipe(map(basket => loadBasketSuccess({ basket })))
      )
    )
  );

  /**
   * After successfully loading the basket, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  loadProductsForBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketSuccess, mergeBasketSuccess),
      mapToPayloadProperty('basket'),
      switchMap(basket => [
        ...basket.lineItems.map(({ productSKU }) =>
          loadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
        ),
      ])
    )
  );

  /**
   * The load basket eligible shipping methods effect.
   */
  loadBasketEligibleShippingMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketEligibleShippingMethods),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      concatMap(([, basket]) =>
        this.basketService.getBasketEligibleShippingMethods(basket.id, basket.bucketId).pipe(
          map(result => loadBasketEligibleShippingMethodsSuccess({ shippingMethods: result })),
          mapErrorToAction(loadBasketEligibleShippingMethodsFail)
        )
      )
    )
  );

  /**
   * Update basket effect.
   */
  updateBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasket),
      mapToPayloadProperty('update'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([update, currentBasketId]) =>
        this.basketService.updateBasket(currentBasketId, update).pipe(
          concatMap(basket => [loadBasketSuccess({ basket }), resetBasketErrors()]),
          mapErrorToAction(updateBasketFail)
        )
      )
    )
  );

  /**
   * Updates the common shipping method of the basket.
   * Works currently only if the basket has one bucket
   */
  updateBasketShippingMethod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketShippingMethod),
      mapToPayloadProperty('shippingId'),
      map(commonShippingMethod => updateBasket({ update: { commonShippingMethod } }))
    )
  );

  /**
   * After a user logged in a merge basket action is triggered if there are already items in the anonymous user's basket
   */
  mergeBasketAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      mergeMapTo(this.store.pipe(select(getCurrentBasket), take(1))),
      filter(currentBasket => currentBasket && currentBasket.lineItems && currentBasket.lineItems.length > 0),
      mapTo(mergeBasket())
    )
  );

  /**
   * Merge basket into current basket of a registered user.
   * If the user has not yet a basket a new basket is created before the merge
   */
  mergeBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(mergeBasket),
      mergeMapTo(this.store.pipe(select(getCurrentBasket), take(1))),
      withLatestFrom(this.store.pipe(select(getLastAPITokenBeforeLogin))),
      concatMap(([sourceBasket, authToken]) =>
        this.basketService.mergeBasket(sourceBasket.id, authToken).pipe(
          map(basket => mergeBasketSuccess({ basket })),
          mapErrorToAction(mergeBasketFail)
        )
      )
    )
  );

  /**
   * Trigger LoadBasket action after LoginUserSuccess, if no pre login state basket items are present.
   */
  loadBasketAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      switchMap(() => this.basketService.getBaskets()) /* prevent 404 error by checking on existing basket */,
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      filter(
        ([newBaskets, currentBasket]) =>
          (!currentBasket || !currentBasket.lineItems || currentBasket.lineItems.length === 0) && newBaskets.length > 0
      ),
      mapTo(loadBasket())
    )
  );

  /**
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route
   * Add queryParam error=true to the route to prevent resetting errors.
   *
   */
  routeListenerForResettingBasketErrors$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/(basket|checkout.*)/),
      select(selectQueryParam('error')),
      whenFalsy(),
      mapTo(resetBasketErrors())
    )
  );
}
