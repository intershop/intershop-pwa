import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Basket } from '../../../../models/basket/basket.model';
import { PriceHelper } from '../../../../models/price/price.model';

@Component({
  selector: 'ish-basket-cost-summary',
  templateUrl: './basket-cost-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCostSummaryComponent implements OnChanges {
  @Input() basket: Basket;

  estimated = true;
  invert = PriceHelper.invert;

  /**
   * If the basket changes estimated flag is recalculated
   */
  ngOnChanges() {
    if (this.basket.invoiceToAddress && this.basket.commonShipToAddress && this.basket.commonShippingMethod) {
      this.estimated = false;
    }
  }
}
