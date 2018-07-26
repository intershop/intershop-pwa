import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BasketTotal } from '../../../../models/basket-total/basket-total.model';
import { PriceHelper } from '../../../../models/price/price.model';

@Component({
  selector: 'ish-basket-cost-summary',
  templateUrl: './basket-cost-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCostSummaryComponent {
  @Input() totals: BasketTotal;

  invert = PriceHelper.invert;
}
