import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, mergeMap, mergeMapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { ofUrl, selectQueryParam } from 'ish-core/store/router';
import { LoadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { UserActionTypes, getLastAPITokenBeforeLogin } from 'ish-core/store/user';
import { mapErrorToAction, mapToPayloadProperty, whenFalsy } from 'ish-core/utils/operators';

import * as basketActions from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private basketService: BasketService) {}

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
    ofType<basketActions.LoadBasketSuccess>(
      basketActions.BasketActionTypes.LoadBasketSuccess,
      basketActions.BasketActionTypes.MergeBasketSuccess
    ),
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
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([, basket]) =>
      this.basketService.getBasketEligibleShippingMethods(basket.id, basket.bucketId).pipe(
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
        concatMap(basket => [new basketActions.LoadBasketSuccess({ basket }), new basketActions.ResetBasketErrors()]),
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
   * Merge basket into current basket of a registered user.
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
    withLatestFrom(this.store.pipe(select(getLastAPITokenBeforeLogin))),
    concatMap(([sourceBasket, authToken]) =>
      this.basketService.mergeBasket(sourceBasket.id, authToken).pipe(
        map(basket => new basketActions.MergeBasketSuccess({ basket })),
        mapErrorToAction(basketActions.MergeBasketFail)
      )
    )
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
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route
   * Add queryParam error=true to the route to prevent resetting errors.
   *
   */
  @Effect()
  routeListenerForResettingBasketErrors$ = this.store.pipe(
    ofUrl(/^\/(basket|checkout.*)/),
    select(selectQueryParam('error')),
    whenFalsy(),
    mapTo(new basketActions.ResetBasketErrors())
  );
}
