import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Basket, BasketHelper } from '../../../../models/basket/basket.model';

/**
 * The Mobile Basket Component displays a basket item count on small mobile devices.
 *
 * @example
 * <ish-mobile-basket [basket]="basket$ | async"></ish-mobile-basket>
 */
@Component({
  selector: 'ish-mobile-basket',
  templateUrl: './mobile-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBasketComponent implements OnChanges {
  /**
   * The basket whos information (the item count) should be displayed.
   */
  @Input()
  basket: Basket;

  itemCount = 0;

  ngOnChanges() {
    if (this.basket) {
      this.itemCount = BasketHelper.getBasketItemsCount(this.basket);
    }
  }
}
