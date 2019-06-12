import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { LoadPromotion, getPromotion } from 'ish-core/store/shopping/promotions';

@Component({
  selector: 'ish-basket-promotion-container',
  templateUrl: './basket-promotion.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPromotionContainerComponent implements OnChanges {
  @Input() rebate: BasketRebate;

  promotion$: Observable<Promotion>;

  constructor(private store: Store<{}>) {}

  ngOnChanges() {
    // select the promotion information from the state for the given product promotion id
    this.promotion$ = this.store.pipe(select(getPromotion, { promoId: this.rebate.promotionId }));
    // trigger a LoadPromotion action for each referenced promotion
    this.store.dispatch(new LoadPromotion({ promoId: this.rebate.promotionId }));
  }
}
