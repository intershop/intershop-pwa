import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
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
  messages = [];

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
        this.hasGeneralBasketError =
          results.errors && results.errors.some(error => error.parameters && !error.parameters.shippingRestriction);

        // display messages only if they are not item related
        this.messages =
          results.errors &&
          results.errors.map(error => (!error.parameters ? error.message : error.parameters.shippingRestriction));
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
