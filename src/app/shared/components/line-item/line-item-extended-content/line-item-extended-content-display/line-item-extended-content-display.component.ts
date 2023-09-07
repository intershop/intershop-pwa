import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';

/**
 * The Line Item Edit Dialog Component displays an edit-dialog of a line items to edit quantity and variation.
 */
@Component({
  selector: 'ish-line-item-extended-content-display',
  templateUrl: './line-item-extended-content-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemExtendedContentDisplayComponent {
  @Input() pli: Partial<LineItemView & OrderLineItem>;
}
