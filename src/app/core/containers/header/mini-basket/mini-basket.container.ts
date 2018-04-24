import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { getCurrentBasket } from '../../../../checkout/store/basket';
import { CheckoutState } from '../../../../checkout/store/checkout.state';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-mini-basket-container',
  templateUrl: './mini-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketContainerComponent implements OnInit {
  basket$: Observable<Basket>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
  }
}
