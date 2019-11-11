import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Product } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Displays the basket validation result message.
 *
 * @example
 * <ish-basket-validation-results></ish-basket-validation-results>
 */
// tslint:disable:ccp-no-intelligence-in-components
@Component({
  selector: 'ish-basket-validation-results',
  templateUrl: './basket-validation-results.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BasketValidationResultsComponent implements OnInit, OnDestroy {
  validationResults$: Observable<BasketValidationResultType>;
  hasGeneralBasketError = false;
  errorMessages = [];
  removedItems: { message: string; product: Product }[];

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;

    // update emitted to display spinning animation
    this.validationResults$
      .pipe(
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(results => {
        this.hasGeneralBasketError = results.errors && results.errors.some(error => this.isLineItemMessage(error));

        // display messages only if they are not item related, filter duplicate entries
        this.errorMessages =
          results.errors &&
          Array.from(
            new Set(
              results.errors &&
                results.errors.map(error => {
                  if (!this.isLineItemMessage(error)) {
                    return error.parameters && error.parameters.shippingRestriction
                      ? error.parameters.shippingRestriction
                      : error.message;
                  }
                })
            )
          );

        this.removedItems =
          results.infos &&
          Array.from(
            new Set(
              results.infos &&
                results.infos
                  .map(info => ({
                    message: info.message,
                    product: info.parameters && info.parameters.product,
                  }))
                  .filter(info => info.product)
            )
          );
        this.cd.detectChanges();
      });
  }

  isLineItemMessage(error: BasketFeedback): boolean {
    return (
      error.parameters &&
      error.parameters.scopes &&
      error.parameters.scopes.includes('Products') &&
      error.parameters.lineItemId &&
      !error.parameters.shippingRestriction
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
