import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getBasketValidationResults } from 'ish-core/store/checkout/basket';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Displays the basket validation result message.
 *
 * @example
 * <ish-basket-validation-results></ish-basket-validation-results>
 */
@Component({
  selector: 'ish-basket-validation-results',
  templateUrl: './basket-validation-results.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})

// tslint:disable-next-line:ccp-no-intelligence-in-components
export class BasketValidationResultsComponent implements OnInit, OnDestroy {
  validationResults$ = this.store.pipe(select(getBasketValidationResults));
  private destroy$ = new Subject();

  hasGeneralBasketError = false;
  messages = [];

  constructor(private store: Store<{}>, private cd: ChangeDetectorRef) {}

  ngOnInit() {
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
