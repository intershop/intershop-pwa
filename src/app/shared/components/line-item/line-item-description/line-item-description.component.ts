import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Line Item Description Component displays detailed line item information.
 * It prodives optional edit functionality
 *
 * @example
 * <ish-line-item-description
 *   [pli]="lineItem"
 *   [editable]="editable"
 *   lineItemViewType="simple"
 *   (updateItem)="onUpdateItem($event)"
 * ></ish-line-item-description>
 */
@Component({
  selector: 'ish-line-item-description',
  templateUrl: './line-item-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemDescriptionComponent {
  @Input() pli: Partial<LineItemView>;
  @Input() product: ProductView;
  @Input() editable = true;
  @Input() lineItemViewType?: 'simple' | 'availability';
  @Output() updateItem = new EventEmitter<LineItemUpdate>();

  isVariationProduct = ProductHelper.isVariationProduct;
  isBundleProduct = ProductHelper.isProductBundle;

  onUpdateItem(event: LineItemUpdate) {
    this.updateItem.emit(event);
  }
}
