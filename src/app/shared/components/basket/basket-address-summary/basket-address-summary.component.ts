import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Basket } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'ish-basket-address-summary',
  templateUrl: './basket-address-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketAddressSummaryComponent {
  @Input() basket: Basket;
}
