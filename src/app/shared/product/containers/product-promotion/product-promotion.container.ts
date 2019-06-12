import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { LoadPromotion, getPromotions } from 'ish-core/store/shopping/promotions';

@Component({
  selector: 'ish-product-promotion-container',
  templateUrl: './product-promotion.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPromotionContainerComponent implements OnChanges {
  @Input() product: Product;
  @Input() displayType?: string;

  promotions$: Observable<Promotion[]>;

  constructor(private store: Store<{}>) {}

  ngOnChanges() {
    // select the promotion information from the state for the given product promotion ids
    this.promotions$ = this.store.pipe(select(getPromotions, { promotionIds: this.product.promotionIds }));

    // trigger a LoadPromotion action for each referenced product promotion
    this.product.promotionIds.forEach(promotionId => {
      this.store.dispatch(new LoadPromotion({ promoId: promotionId }));
    });
  }
}
