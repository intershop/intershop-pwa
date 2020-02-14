import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { uniq } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketFeedback } from 'ish-core/models/basket-feedback/basket-feedback.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

/**
 * Displays the basket validation result messages. In case of basket adjustments removed or undeliverable items are
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

  hasGeneralBasketError$: Observable<boolean>;
  errorMessages$: Observable<string[]>;
  infoMessages$: Observable<string[]>;
  undeliverableItems$: Observable<LineItemView[]>;
  removedItems$: Observable<{ message: string; product: ProductView }[]>;

  itemHasBeenRemoved = false;

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade) {}

  @Output() continueCheckout = new EventEmitter<void>();

  ngOnInit() {
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;

    // update emitted to display spinning animation
    this.validationResults$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.itemHasBeenRemoved) {
        this.continueCheckout.emit();
        this.itemHasBeenRemoved = false;
      }
    });

    this.hasGeneralBasketError$ = this.validationResults$.pipe(
      map(results => results && results.errors && results.errors.some(error => this.isLineItemMessage(error)))
    );

    this.errorMessages$ = this.validationResults$.pipe(
      map(results =>
        uniq(
          results &&
            results.errors &&
            results.errors
              .filter(
                error =>
                  !this.isLineItemMessage(error) &&
                  error.code !== 'basket.validation.line_item_shipping_restrictions.error'
              )
              .map(error =>
                error.parameters && error.parameters.shippingRestriction
                  ? error.parameters.shippingRestriction
                  : error.message
              )
        ).filter(message => !!message)
      )
    );

    this.undeliverableItems$ = this.validationResults$.pipe(
      map(
        results =>
          results &&
          results.errors &&
          results.errors
            .filter(
              error =>
                error.code === 'basket.validation.line_item_shipping_restrictions.error' &&
                error.lineItem &&
                error.product
            )
            .map(error => ({ ...error.lineItem, product: error.product }))
      )
    );

    this.removedItems$ = this.validationResults$.pipe(
      map(
        results =>
          results &&
          results.infos &&
          results.infos
            .map(info => ({
              message: info.message,
              product: info.product,
            }))
            .filter(info => info.product)
      )
    );

    this.infoMessages$ = this.validationResults$.pipe(
      map(results =>
        uniq(results && results.infos && results.infos.filter(info => !info.product).map(info => info.message)).filter(
          message => !!message
        )
      )
    );
  }

  isLineItemMessage(error: BasketFeedback): boolean {
    return !!(
      error.parameters &&
      error.code !== 'basket.validation.line_item_shipping_restrictions.error' &&
      error.parameters.scopes &&
      (error.parameters.scopes.includes('Addresses') || error.parameters.scopes.includes('Products')) &&
      error.parameters.lineItemId
    );
  }

  deleteItem(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
    this.itemHasBeenRemoved = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
