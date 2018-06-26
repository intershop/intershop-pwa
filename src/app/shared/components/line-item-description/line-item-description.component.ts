import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { BasketItemView } from '../../../models/basket-item/basket-item.model';
import { Price } from '../../../models/price/price.model';
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
export class LineItemDescriptionComponent implements OnChanges {
  @Input() pli: BasketItemView | QuoteRequestItemView;

  itemSurcharges: { amount: Price; description?: string; displayName?: string; text?: string }[] = [];

  /**
   * If the line item changes new itemSurcharges are set
   */
  ngOnChanges() {
    const item = this.pli as BasketItemView;

    if (item.itemSurcharges) {
      this.itemSurcharges = item.itemSurcharges;
    }
  }
}
