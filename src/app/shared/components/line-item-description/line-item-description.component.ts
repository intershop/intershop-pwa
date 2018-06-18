import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BasketItemView } from '../../../models/basket-item/basket-item.model';
import { QuoteRequestItemView } from '../../../models/quote-request-item/quote-request-item.model';

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
  @Input() pli: BasketItemView | QuoteRequestItemView;
}
