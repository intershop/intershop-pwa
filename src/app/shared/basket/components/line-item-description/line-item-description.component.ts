import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';

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
  @Input()
  pli: LineItemView;

  itemSurcharges: { amount: Price; description?: string; displayName?: string; text?: string }[] = [];

  /**
   * If the line item changes new itemSurcharges are set
   */
  ngOnChanges() {
    this.itemSurcharges = undefined;

    if (this.pli.itemSurcharges) {
      this.itemSurcharges = this.pli.itemSurcharges;
    }
  }
}
