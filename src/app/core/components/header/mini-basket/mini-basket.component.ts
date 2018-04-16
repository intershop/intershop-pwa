// NEEDS_WORK: DETAIL ITEM CONTENT MISSING
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Basket, BasketHelper } from '../../../../models/basket/basket.model';
import { ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-mini-basket',
  templateUrl: './mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketComponent implements OnChanges {
  @Input() basket: Basket;

  generateProductRoute = ProductHelper.generateProductRoute;
  isCollapsed = true;
  itemsCount = 0;

  ngOnChanges() {
    if (this.basket) {
      this.itemsCount = BasketHelper.getBasketItemsCount(this.basket);
    }
  }
}
