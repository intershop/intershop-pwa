import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';

/**
 * The Extended Line Item Component displays additional line items attributes like partialOrderNo
 * and customerProductID. ALso editing of this attributes are possible with this component.
 */
@Component({
  selector: 'ish-line-item-extended-content-display',
  templateUrl: './line-item-extended-content-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemExtendedContentDisplayComponent {
  @Input() lineItem: Partial<LineItemView & OrderLineItem>;
}
