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
    this.promotions$ = this.store.pipe(select(getPromotions, { promotionIds: this.product.promotionIds }));

    // Todo:
    // Checks if the promotion is already in the store and only dispatches a LoadPromotion action if it is not
    // Optimize it!
    this.product.promotionIds.forEach(promotionId => {
      this.store.dispatch(new LoadPromotion({ promoId: promotionId }));
    });
  }
}
