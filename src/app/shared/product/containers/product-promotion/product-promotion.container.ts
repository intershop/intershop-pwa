import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { LoadPromotion, getPromotion } from 'ish-core/store/shopping/promotions';

@Component({
  selector: 'ish-product-promotion-container',
  templateUrl: './product-promotion.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPromotionContainerComponent implements OnInit {
  @Input() promotionId: string;

  promotion$: Observable<Promotion>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.promotion$ = this.store.pipe(select(getPromotion, { id: this.promotionId }));
    // Checks if the promotion is already in the store and only dispatches a LoadPromotion action if it is not
    this.promotion$
      .pipe(
        take(1),
        filter(x => !x)
      )
      .subscribe(() => this.store.dispatch(new LoadPromotion({ id: this.promotionId })));
  }
}
