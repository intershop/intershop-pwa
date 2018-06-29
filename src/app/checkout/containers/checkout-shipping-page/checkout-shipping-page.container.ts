import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Basket } from '../../../models/basket/basket.model';
import { getBasketLoading, getCurrentBasket } from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-checkout-shipping-page-container',
  templateUrl: './checkout-shipping-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingPageContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  loading$: Observable<boolean>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.loading$ = this.store.pipe(select(getBasketLoading));
  }
}
