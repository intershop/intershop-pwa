import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { BasketView } from '../../../../models/basket/basket.model';
import { HttpError } from '../../../../models/http-error/http-error.model';

/**
 * The Shopping Basket Component displays the users basket items and cost summary.
 * It provides update cart and add cart to quote functionality.
 * It is the starting point for the checkout workflow.
 *
 * It uses the {@link LineItemListComponent} for the rendering of line items.
 * It uses the {@link BasketCostSummaryComponent} to render the cost summary.
 * It uses the {@link BasketAddToQuoteComponent} to provide add to quote functionality.
 *
 * @example
 * <ish-shopping-basket
 *   [basket]="basket"
 *   (updateItem)="updateItem($event)"
 *   (deleteItem)="deleteItem($event)"
 *   (addBasketToQuote)="addBasketToQuote()"
 * ></ish-shopping-basket>
 */
@Component({
  selector: 'ish-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketComponent {
  @Input()
  basket: BasketView;
  @Input()
  error: HttpError;

  @Output()
  updateItem = new EventEmitter<{ itemId: string; quantity: number }>();
  @Output()
  deleteItem = new EventEmitter<string>();
  @Output()
  addBasketToQuote = new EventEmitter<void>();

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
  onUpdateItem(item: { itemId: string; quantity: number }) {
    this.updateItem.emit(item);
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   */
  onDeleteItem(itemId) {
    this.deleteItem.emit(itemId);
  }

  /**
   * checkout button leads to checkout address page
   */
  checkout() {
    // ToDo: routing should be handled in another way, see #ISREST-317
    this.router.navigate(['/checkout/address']);
  }

  /**
   * Throws addBasketToQuote event when addToQuote is triggered.
   */
  onAddToQuote() {
    this.addBasketToQuote.emit();
  }
}
