import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getCurrentBasket } from '../../../../checkout/store/basket';
import { CheckoutState } from '../../../../checkout/store/checkout.state';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-mobile-basket-container',
  templateUrl: './mobile-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBasketContainerComponent implements OnInit {
  basket$: Observable<Basket>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
  }
}
