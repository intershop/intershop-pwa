import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
export class ProductPromotionContainerComponent implements OnInit {
  @Input() product: Product;
  @Input() displayType?: string;

  promotions$: Observable<Promotion[]>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.promotions$ = this.store.pipe(select(getPromotions, { productPromotions: this.product.promotions }));

    // Checks if the promotion is already in the store and only dispatches a LoadPromotion action if it is not
    // optimize
    this.product.promotions.forEach(productPromotion => {
      this.store.dispatch(new LoadPromotion({ promoId: productPromotion.itemId }));
    });
  }
}
