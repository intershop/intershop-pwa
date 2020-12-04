import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, tap, withLatestFrom } from 'rxjs/operators';

import {
  BasketValidationResultType,
  BasketValidationScopeType,
} from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { createOrder } from 'ish-core/store/customer/orders';
import { loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { spContinueCheckout } from './sp-checkout.action';
import {
  continueCheckoutFail,
  continueCheckoutSuccess,
  continueCheckoutWithIssues,
  loadBasketEligiblePaymentMethods,
  loadBasketEligibleShippingMethods,
} from 'ish-core/store/customer/basket/basket.actions';
import { getCurrentBasketId } from 'ish-core/store/customer/basket/basket.selectors';

@Injectable()
export class SpCheckoutEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private basketService: BasketService
  ) {}

  /**
   * Validates the basket before the user is allowed to jump to the next basket step
   */
  validateBasketAndContinueCheckout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(spContinueCheckout),
      mapToPayloadProperty('targetStep'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      whenTruthy(),
      concatMap(([targetStep, basketId]) => {
        let scopes: BasketValidationScopeType[] = [''];
        let targetRoute = '';
        switch (targetStep) {
          case 1: {
            scopes = ['Products', 'Value'];
            targetRoute = '/checkout-spa/address';
            break;
          }
          case 2: {
            scopes = ['InvoiceAddress', 'ShippingAddress', 'Addresses', 'Shipping'];
            targetRoute = '/checkout-spa/shipping-payment';
            break;
          }
          case 3: {
            scopes = ['Payment'];
            targetRoute = '/checkout-spa/review';
            break;
          }
          // before order creation the whole basket is validated again
          case 5: {
            scopes = ['All'];
            targetRoute = 'auto'; // targetRoute will be calculated in dependence of the validation result
            break;
          }
        }
        return this.basketService.validateBasket(basketId, scopes).pipe(
          concatMap(basketValidation =>
            basketValidation.results.valid
              ? targetStep === 5 && !basketValidation.results.adjusted
                ? [createOrder({ basketId }), continueCheckoutSuccess({ targetRoute: undefined, basketValidation })]
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
  jumpToNextCheckoutStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(continueCheckoutSuccess, continueCheckoutWithIssues),
      mapToPayload(),
      tap(payload => {
        this.jumpToTargetRoute(payload.targetRoute, payload.basketValidation && payload.basketValidation.results);
      }),

      filter(
        payload =>
          payload.basketValidation &&
          payload.basketValidation.results.adjusted &&
          !!payload.basketValidation.results.infos
      ),
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
            .filter(info => info.parameters && info.parameters.productSku)
            .map(info => loadProduct({ sku: info.parameters.productSku }));
        }
      })
    )
  );

  /**
   * Navigates to the target route, in case targetRoute equals 'auto' the target route will be calculated based on the calculation result
   */
  private jumpToTargetRoute(targetRoute: string, results: BasketValidationResultType) {
    if (!targetRoute || !results) {
      return;
    }
    if (targetRoute === 'auto') {
      // determine where to go if basket validation finished with an issue before order creation
      // consider the 1st error or info - maybe this logic can be enhanced later on
      let scope =
        results.errors && results.errors.find(issue => issue.parameters && issue.parameters.scopes).parameters.scopes;
      if (!scope) {
        scope =
          results.infos && results.infos.find(issue => issue.parameters && issue.parameters.scopes).parameters.scopes;
      }

      switch (scope) {
        case 'Products':
        case 'Value': {
          this.router.navigate(['/basket'], { queryParams: { error: true } });
          break;
        }
        case 'Addresses':
        case 'ShippingAddress':
        case 'InvoiceAddress': {
          this.router.navigate(['/checkout-spa/address'], { queryParams: { error: true } });
          break;
        }
        case 'Shipping':
        case 'Payment': {
          this.router.navigate(['/checkout-spa/shipping-payment'], { queryParams: { error: true } });
          break;
        }
        // otherwise stay on the current page
      }
    } else if (results.valid && !results.adjusted) {
      this.router.navigate([targetRoute]);
    }
  }
}
