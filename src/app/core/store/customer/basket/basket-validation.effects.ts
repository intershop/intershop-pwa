import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { intersection } from 'lodash-es';
import { EMPTY, Observable, from } from 'rxjs';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { BasketFeedbackView } from 'ish-core/models/basket-feedback/basket-feedback.model';
import {
  BasketValidationResultType,
  BasketValidationScopeType,
} from 'ish-core/models/basket-validation/basket-validation.model';
import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { createOrder } from 'ish-core/store/customer/orders';
import { loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  continueCheckout,
  continueCheckoutFail,
  continueCheckoutSuccess,
  continueCheckoutWithIssues,
  loadBasketEligiblePaymentMethods,
  loadBasketEligibleShippingMethods,
  startCheckout,
  startCheckoutFail,
  startCheckoutSuccess,
  submitBasket,
  validateBasket,
} from './basket.actions';
import { getCurrentBasket } from './basket.selectors';

@Injectable()
export class BasketValidationEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private basketService: BasketService
  ) {}

  // validation step for each checkout step type
  private validationSteps: { [targetStep: string | number]: { scopes: BasketValidationScopeType[]; route: string } } = {
    [CheckoutStepType.BeforeCheckout]: { scopes: ['Products', 'Promotion', 'Value', 'CostCenter'], route: '/basket' },
    [CheckoutStepType.Addresses]: {
      scopes: ['InvoiceAddress', 'ShippingAddress', 'Addresses'],
      route: '/checkout/address',
    },
    [CheckoutStepType.Shipping]: { scopes: ['Shipping'], route: '/checkout/shipping' },
    [CheckoutStepType.Payment]: { scopes: ['Payment'], route: '/checkout/payment' },
    [CheckoutStepType.Review]: { scopes: ['All', 'CostCenter'], route: '/checkout/review' }, // ToDo: has to be changed if the cost center approval has been implemented
    [CheckoutStepType.Receipt]: { scopes: ['All'], route: 'auto' }, // targetRoute will be calculated in dependence of the validation result
  };

  /**
   * Jumps to the first checkout step (no basket acceleration)
   */
  startCheckoutWithoutAcceleration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startCheckout),
      withLatestFrom(this.store.pipe(select(getServerConfigParameter<boolean>('basket.acceleration')))),
      filter(([, acc]) => !acc),
      map(() => continueCheckout({ targetStep: CheckoutStepType.Addresses }))
    )
  );

  /**
   * Check the basket before starting the basket acceleration
   */
  startCheckoutWithAcceleration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startCheckout),
      withLatestFrom(this.store.pipe(select(getServerConfigParameter<boolean>('basket.acceleration')))),
      filter(([, acc]) => acc),
      concatMap(() =>
        this.basketService.validateBasket(this.validationSteps[CheckoutStepType.BeforeCheckout].scopes).pipe(
          map(basketValidation => startCheckoutSuccess({ basketValidation })),
          mapErrorToAction(startCheckoutFail)
        )
      )
    )
  );

  /**
   * Validates the basket and jumps to the next possible checkout step (basket acceleration)
   */
  continueCheckoutWithAcceleration$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(startCheckoutSuccess),
        mapToPayload(),
        map(payload => payload.basketValidation.results),
        filter(results => results.valid && !results.adjusted),
        concatMap(() =>
          this.basketService
            .validateBasket(this.validationSteps[CheckoutStepType.Review].scopes)
            .pipe(
              concatMap(basketValidation =>
                basketValidation?.results?.valid
                  ? from(this.router.navigate([this.validationSteps[CheckoutStepType.Review].route]))
                  : this.jumpToTargetRoute('auto', basketValidation?.results)
              )
            )
        )
      ),
    { dispatch: false }
  );

  /**
   * validates the basket but doesn't change the route
   */
  validateBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validateBasket),
      mapToPayloadProperty('scopes'),
      whenTruthy(),
      concatMap(scopes =>
        this.basketService.validateBasket(scopes).pipe(
          map(basketValidation =>
            basketValidation.results.valid
              ? continueCheckoutSuccess({ targetRoute: undefined, basketValidation })
              : continueCheckoutWithIssues({ targetRoute: undefined, basketValidation })
          ),
          mapErrorToAction(continueCheckoutFail)
        )
      )
    )
  );

  /**
   * Validates the basket before the user is allowed to jump to the next basket step
   */
  validateBasketAndContinueCheckout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(continueCheckout),
      mapToPayloadProperty('targetStep'),
      whenTruthy(),
      concatMap(targetStep => {
        const targetRoute = this.validationSteps[targetStep].route;

        return this.basketService.validateBasket(this.validationSteps[targetStep - 1].scopes).pipe(
          withLatestFrom(this.store.pipe(select(getCurrentBasket))),
          concatMap(([basketValidation, basket]) =>
            basketValidation.results.valid
              ? targetStep === CheckoutStepType.Receipt && !basketValidation.results.adjusted
                ? basket.approval?.approvalRequired
                  ? [continueCheckoutSuccess({ targetRoute: undefined, basketValidation }), submitBasket()]
                  : [continueCheckoutSuccess({ targetRoute: undefined, basketValidation }), createOrder()]
                : [continueCheckoutSuccess({ targetRoute, basketValidation })]
              : [continueCheckoutWithIssues({ targetRoute, basketValidation })]
          ),
          mapErrorToAction(continueCheckoutFail)
        );
      })
    )
  );

  /**
   * Jumps to the next checkout step after basket validation. In case of adjustments related data like product data, eligible shipping methods etc. are loaded.
   */
  jumpToNextCheckoutStep$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(continueCheckoutSuccess, continueCheckoutWithIssues),
        mapToPayload(),
        concatMap(payload => this.jumpToTargetRoute(payload.targetRoute, payload.basketValidation?.results))
      ),
    { dispatch: false }
  );

  loadDataForNextCheckoutStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(continueCheckoutSuccess, continueCheckoutWithIssues),
      mapToPayload(),
      filter(payload => payload.basketValidation?.results.adjusted && !!payload.basketValidation.results.infos),
      map(payload => payload.basketValidation),
      concatMap(validation => {
        // Load eligible shipping methods if shipping infos are available
        if (validation.scopes.includes('Shipping')) {
          return [loadBasketEligibleShippingMethods()];
          // Load eligible payment methods if payment infos are available
        } else if (validation.scopes.includes('Payment')) {
          return [loadBasketEligiblePaymentMethods()];
        } else {
          // Load products if product related infos are available
          return validation.results.infos
            .filter(info => info.parameters?.productSku)
            .map(info => loadProduct({ sku: info.parameters.productSku }));
        }
      })
    )
  );

  private extractScopes(elements: BasketFeedbackView[]): string[] {
    return elements
      ?.filter(el => !!el.parameters?.scopes?.length)
      .reduce((acc, el) => [...acc, ...el.parameters.scopes], [])
      .filter((val, idx, arr) => !!val && arr.indexOf(val) === idx);
  }

  /**
   * Navigates to the target route, in case targetRoute equals 'auto' the target route will be calculated based on the calculation result
   */
  private jumpToTargetRoute(targetRoute: string, results: BasketValidationResultType): Observable<boolean> {
    if (!targetRoute || !results) {
      return EMPTY;
    }

    if (targetRoute === 'auto') {
      let scopes = this.extractScopes(results.errors);
      if (!scopes?.length) {
        scopes = this.extractScopes(results.infos);
      }

      const foundKey = Object.keys(this.validationSteps).find(
        key => intersection(this.validationSteps[key].scopes, scopes).length
      );

      const foundStep = this.validationSteps[foundKey];

      if (foundStep) {
        return from(this.router.navigate([foundStep.route], { queryParams: { error: true } }));
      }
      // otherwise stay on the current page
    } else if (results.valid && !results.adjusted) {
      return from(this.router.navigate([targetRoute]));
    }

    return EMPTY;
  }
}
