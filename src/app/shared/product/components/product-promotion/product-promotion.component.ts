import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Promotion } from 'ish-core/models/promotion/promotion.model';

/**
 * The Product Promotion Component displays all the Promotion data details
 * of a product.
 *
 * @example
 * <ish-product-promotion
 *   [promotions]="promotions"
 *   displayType="simple"
 * ></ish-product-promotion>
 */
@Component({
  selector: 'ish-product-promotion',
  templateUrl: './product-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPromotionComponent {
  @Input() promotions: Promotion[];
  @Input() displayType?: string;
}
