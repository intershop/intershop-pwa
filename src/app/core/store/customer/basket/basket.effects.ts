import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterNavigatedPayload, routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, combineLatest, iif, of } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, sample, startWith, switchMap, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { RouterState } from 'ish-core/store/core/router/router.reducer';
import { loginUser, loginUserSuccess } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  loadBasket,
  loadBasketByAPIToken,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
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
  constructor(
    private actions$: Actions,
    private store: Store,
    private basketService: BasketService,
    private apiTokenService: ApiTokenService
  ) {}

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
   * The load basket eligible shipping methods effect.
   */
  loadBasketEligibleShippingMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketEligibleShippingMethods),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      concatMap(([, basket]) =>
        this.basketService.getBasketEligibleShippingMethods(basket.bucketId).pipe(
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
      concatMap(update =>
        this.basketService.updateBasket(update).pipe(
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
   * dummy effect keeping the anonymous basket with the corresponding apiToken for the basket merge call
   */
  private anonymousBasket$ = createEffect(
    () =>
      combineLatest([this.store.pipe(select(getCurrentBasketId)), this.apiTokenService.apiToken$]).pipe(
        sample(this.actions$.pipe(ofType(loginUser))),
        startWith([undefined, undefined])
      ),
    { dispatch: false }
  );

  /**
   * loading and handling merges of the users baskets, when the user logs in
   */
  loadOrMergeBasketAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      withLatestFrom(this.anonymousBasket$),
      switchMap(([, [sourceBasketId, sourceApiToken]]) =>
        this.basketService.getBaskets().pipe(
          switchMap(baskets => {
            if (sourceBasketId) {
              // anonymous basket exists -> get or create user basket and merge anonymous basket into it
              return iif(
                () => !!baskets.length,
                this.basketService.getBasket(),
                this.basketService.createBasket()
              ).pipe(
                switchMap(newOrCurrentUserBasket =>
                  this.basketService
                    .mergeBasket(sourceBasketId, sourceApiToken, newOrCurrentUserBasket.id)
                    .pipe(map(basket => mergeBasketSuccess({ basket })))
                ),
                mapErrorToAction(mergeBasketFail)
              );
            } else if (baskets.length) {
              // no anonymous basket exists and user already has a basket -> load it
              return of(loadBasket());
            } else {
              // no anonymous or user basket -> do nothing
              return EMPTY;
            }
          })
        )
      )
    )
  );

  /**
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route
   * Add queryParam error=true to the route to prevent resetting errors.
   *
   */
  routeListenerForResettingBasketErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToPayloadProperty<RouterNavigatedPayload<RouterState>>('routerState'),
      filter(
        (routerState: RouterState) => /^\/(basket|checkout.*)/.test(routerState.url) && !routerState.queryParams?.error
      ),
      mapTo(resetBasketErrors())
    )
  );
}
