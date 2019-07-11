import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { LoadPromotion, getPromotions } from 'ish-core/store/shopping/promotions';

@Component({
  selector: 'ish-product-promotion-container',
  templateUrl: './product-promotion.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPromotionContainerComponent implements OnChanges, OnDestroy {
  @Input() product: Product;
  @Input() displayType?: string;

  promotions$: Observable<Promotion[]>;

  private destroy$ = new Subject();

  constructor(private store: Store<{}>) {}

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngOnChanges() {
    if (this.product && this.product.promotionIds) {
      // select the promotion information from the state for the given product promotion ids
      this.promotions$ = this.store.pipe(
        select(getPromotions, { promotionIds: this.product.promotionIds }),
        takeUntil(this.destroy$)
      );

      // trigger a LoadPromotion action for each referenced product promotion
      this.product.promotionIds.forEach(promotionId => {
        this.store.dispatch(new LoadPromotion({ promoId: promotionId }));
      });
    }
  }
}
