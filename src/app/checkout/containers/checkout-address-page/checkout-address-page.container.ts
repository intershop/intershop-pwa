import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Basket } from '../../../models/basket/basket.model';
import { getBasketLoading, getCurrentBasket } from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-checkout-address-page-container',
  templateUrl: './checkout-address-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressPageContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  basketLoading$: Observable<boolean>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.basketLoading$ = this.store.pipe(select(getBasketLoading));
  }
}
