// NEEDS_WORK: DETAIL ITEM CONTENT MISSING
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-mini-cart',
  templateUrl: './mini-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCartComponent implements OnChanges {
  @Input() basket: Basket;

  isCollapsed = true;
  itemsCount = 0;

  ngOnChanges() {
    if (this.basket) {
      // TODO: add necessary api values to get real item count
      this.itemsCount = this.basket.lineItems.length;
    }
  }
}
