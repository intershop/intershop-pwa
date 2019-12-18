import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';

@Component({
  selector: 'ish-basket-promotion',
  templateUrl: './basket-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPromotionComponent implements OnChanges {
  @Input() rebate: BasketRebate;

  promotion$: Observable<Promotion>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges() {
    if (this.rebate && this.rebate.promotionId) {
      this.promotion$ = this.shoppingFacade.promotion$(this.rebate.promotionId);
    }
  }
}
