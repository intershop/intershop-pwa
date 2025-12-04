import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ish-promotion-remove',
  templateUrl: './promotion-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, TranslateModule],
})
export class PromotionRemoveComponent implements OnInit {
  basket$: Observable<BasketView>;

  @Input({ required: true }) code: string;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
  }

  removePromotion() {
    this.checkoutFacade.removePromotionCodeFromBasket(this.code);
  }
}
