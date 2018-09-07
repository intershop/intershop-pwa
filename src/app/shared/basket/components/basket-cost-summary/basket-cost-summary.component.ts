import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BasketTotal } from '../../../../models/basket-total/basket-total.model';
import { PriceHelper } from '../../../../models/price/price.model';

/**
 * The Cost Summary Component displays a detailed summary of basket or order costs, respectively.
 *
 * @example
 * <ish-basket-cost-summary
 *   [totals]="basket.totals"
 * ></ish-basket-cost-summary>
 */
@Component({
  selector: 'ish-basket-cost-summary',
  templateUrl: './basket-cost-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCostSummaryComponent {
  @Input()
  totals: BasketTotal;

  invert = PriceHelper.invert;
}
