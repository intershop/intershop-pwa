import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';

/**
 * Displays the basket validation result items, e.g. items that cannot be shipped to the basket shipping address.
 *
 * @example
 * <ish-basket-validation-items [lineItems]="undeliverableItems" (deleteItem)="deleteItem($event)"></ish-basket-validation-items>
 */
@Component({
  selector: 'ish-basket-validation-items',
  templateUrl: './basket-validation-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketValidationItemsComponent {
  @Input() lineItems: LineItemView[];
  @Output() deleteItem = new EventEmitter<string>();

  /**
   * Throws deleteItem event when delete button was clicked.
   * @param itemId The id of the item that should be deleted.
   */
  onDeleteItem(itemId: string) {
    this.deleteItem.emit(itemId);
  }
}
