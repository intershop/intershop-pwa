import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';

@Component({
  selector: 'ish-product-promotion',
  templateUrl: './product-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPromotionComponent implements OnChanges {
  @Input() product: Product;
  @Input() displayType?: string;

  promotions$: Observable<Promotion[]>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges() {
    if (this.product && this.product.promotionIds) {
      this.promotions$ = this.shoppingFacade.promotions$(this.product.promotionIds);
    }
  }
}
