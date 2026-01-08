import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

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
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    PricePipe,
    ProductImageComponent,
    TranslateModule,
    ProductNameComponent,
    ProductInventoryComponent,
    ProductContextDirective,
  ],
})
export class BasketValidationItemsComponent {
  @Input({ required: true }) lineItems: LineItemView[];
  @Output() deleteItem = new EventEmitter<string>();

  /**
   * Throws deleteItem event when delete button was clicked.
   *
   * @param itemId The id of the item that should be deleted.
   */
  onDeleteItem(itemId: string) {
    this.deleteItem.emit(itemId);
  }
}
