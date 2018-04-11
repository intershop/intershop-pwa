// NEEDS_WORK: DUMMY COMPONENT
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { BasketHelper } from '../../../../models/basket/basket.helper';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-mini-cart',
  templateUrl: './mini-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCartComponent implements OnChanges {
  @Input() basket: Basket;

  isCollapsed = true;
  itemsCount: number;

  ngOnChanges() {
    if (!this.basket) {
      throw new Error('required input parameter <basket> is missing for MiniCartComponent');
    }
    this.itemsCount = BasketHelper.getBasketItemsCount(this.basket);
  }
}
