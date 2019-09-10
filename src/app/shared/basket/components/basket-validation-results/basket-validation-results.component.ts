// tslint:disable:ccp-no-intelligence-in-components
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getBasketValidationResults } from 'ish-core/store/checkout/basket';

/**
 * Displays the basket validation result message.
 *
 * @example
 * <ish-basket-validation-results></ish-basket-validation-results>
 */
@Component({
  selector: 'ish-basket-validation-results',
  templateUrl: './basket-validation-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketValidationResultsComponent {
  validationResults$ = this.store.pipe(select(getBasketValidationResults));

  constructor(private store: Store<{}>) {}
}
