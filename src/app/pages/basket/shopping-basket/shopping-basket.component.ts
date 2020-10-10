import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Shopping Basket Component displays the users basket items, cost summary
 * and promotion code input.
 * It provides update cart and add cart to quote functionality.
 * It is the starting point for the checkout workflow.
 *
 * It uses the {@link LineItemListComponent} for the rendering of line items.
 * It uses the {@link BasketCostSummaryComponent} to render the cost summary.
 * It uses the {@link BasketPromotionCodeComponent} to render the promotion code input.
 *
 * @example
 * <ish-shopping-basket
 *   [basket]="basket"
 *   (updateItem)="updateItem($event)"
 *   (deleteItem)="deleteItem($event)"
 *   (nextStep)="nextStep()"
 * ></ish-shopping-basket>
 */
@Component({
  selector: 'ish-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketComponent {
  @Input() basket: BasketView;
  @Input() error: HttpError;

  @Output() nextStep = new EventEmitter<void>();

  submitted = false;

  /**
   * checkout button leads to checkout address page if basket is valid
   */
  checkout() {
    this.nextStep.emit();
  }
}
