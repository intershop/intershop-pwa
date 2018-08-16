import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BasketView } from '../../../../models/basket/basket.model';
import { ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-basket-items-summary',
  templateUrl: './basket-items-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketItemsSummaryComponent {
  @Input()
  basket: BasketView;

  generateProductRoute = ProductHelper.generateProductRoute;
  isCollapsed = true;
  collapsedItemsCount = 3;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
