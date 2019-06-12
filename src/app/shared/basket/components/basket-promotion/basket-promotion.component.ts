import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Promotion } from 'ish-core/models/promotion/promotion.model';

/**
 * The Basket Promotion Component displays all the Promotion data details
 * of a basket rebate.
 *
 * @example
 * <ish-basket-promotion
 *   [promotion]="promotion"
 * ></ish-basket-promotion>
 */
@Component({
  selector: 'ish-basket-promotion',
  templateUrl: './basket-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPromotionComponent {
  @Input() promotion: Promotion;
}
