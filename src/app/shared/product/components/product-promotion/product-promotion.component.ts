import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Promotion } from 'ish-core/models/promotion/promotion.model';

@Component({
  selector: 'ish-product-promotion',
  templateUrl: './product-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPromotionComponent {
  @Input() promotion: Promotion;
}
