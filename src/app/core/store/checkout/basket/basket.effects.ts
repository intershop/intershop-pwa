import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';
import { BasketService } from '../../../services/basket/basket.service';
import { LoadProduct, getProductEntities } from '../../shopping/products';
import { UserActionTypes } from '../../user';

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
    mapToPayloadProperty('quoteId'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([, basketId]) => !!basketId),
    concatMap(([quoteId, basketId]) =>
      this.basketService.addQuoteToBasket(quoteId, basketId).pipe(
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
    mapToPayloadProperty('quoteId'),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([, basketId]) => !basketId),
    mergeMap(([quoteId]) =>
      this.basketService.createBasket().pipe(mapTo(new basketActions.AddQuoteToBasket({ quoteId })))
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
    mapTo(new basketActions.UpdateBasket({ update: { calculationState: 'CALCULATED' } }))
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
   * Trigger ResetBasket action after LogoutUser.
   */
  @Effect()
  resetBasketAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),

    mapTo(new basketActions.ResetBasket())
  );
}
