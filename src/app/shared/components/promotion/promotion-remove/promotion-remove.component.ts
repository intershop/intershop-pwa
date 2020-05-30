import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'ish-promotion-remove',
  templateUrl: './promotion-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionRemoveComponent implements OnInit {
  basket$: Observable<BasketView>;

  @Input() code: string;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
  }

  removePromotion() {
    this.checkoutFacade.removePromotionCodeFromBasket(this.code);
  }
}
