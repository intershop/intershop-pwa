import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BasketView } from '../../../../models/basket/basket.model';

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
export class MobileBasketComponent {
  /**
   * The basket whos information (the item count) should be displayed.
   */
  @Input()
  basket: BasketView;
}
