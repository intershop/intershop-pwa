import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getCurrentBasket } from '../../../../checkout/store/basket';
import { CheckoutState } from '../../../../checkout/store/checkout.state';
import { BasketView } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-mini-basket-container',
  templateUrl: './mini-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketContainerComponent implements OnInit {
  basket$: Observable<BasketView>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
  }
}
