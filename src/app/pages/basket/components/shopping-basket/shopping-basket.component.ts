import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

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

  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  @Output() deleteItem = new EventEmitter<string>();
  @Output() nextStep = new EventEmitter<void>();

  form: FormGroup;
  submitted = false;

  constructor(private router: Router) {
    this.form = new FormGroup({});
  }

  /**
   * Create new Form Group which contains line items from child component
   * @param lineItemForm The child components form group.
   */
  onFormChange(lineItemForm: FormGroup) {
    this.form = new FormGroup({
      inner: lineItemForm,
    });
  }

  /**
   * Throws updateItem event when onUpdateItem event trigggerd.
   * @param item Item id and quantity pair that should be changed
   */
  onUpdateItem(item: LineItemUpdate) {
    this.updateItem.emit(item);
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   */
  onDeleteItem(itemId) {
    this.deleteItem.emit(itemId);
  }

  /**
   * checkout button leads to checkout address page if basket is valid
   */
  checkout() {
    this.nextStep.emit();
  }
}
