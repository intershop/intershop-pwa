import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Line Item Description Component displays detailed line item information.
 * It prodived delete and edit functionality
 *
 * @example
 * <ish-line-item-description
 *   [pli]="lineItem"
 * ></ish-line-item-description>
 */
@Component({
  selector: 'ish-line-item-description',
  templateUrl: './line-item-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemDescriptionComponent {
  @Input() pli: LineItemView;

  isVariationProduct = ProductHelper.isVariationProduct;
}
