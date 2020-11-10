import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Line Item Edit Component displays an edit-link and edit-dialog.
 * It prodives optional edit functionality
 *
 * @example
 * <ish-line-item-edit
 *   [lineItem]="lineItem"
 *   [editable]="editable"
 *   (updateItem)="onUpdateItem($event)"
 * ></ish-line-item-edit>
 */
@Component({
  selector: 'ish-line-item-edit',
  templateUrl: './line-item-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemEditComponent {
  @Input() lineItem: Partial<LineItemView>;
  @Input() product: ProductView;
  @Input() editable = true;
  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  isVariationProduct = ProductHelper.isVariationProduct;

  onUpdateItem(event: LineItemUpdate) {
    this.updateItem.emit(event);
  }
}
