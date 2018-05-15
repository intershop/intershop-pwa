import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInUser } from '../../../core/store/user';
import { Basket } from '../../../models/basket/basket.model';
import { Customer } from '../../../models/customer/customer.model';
import { getBasketLoading, getCurrentBasket } from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-checkout-address-page-container',
  templateUrl: './checkout-address-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressPageContainerComponent implements OnInit {
  customer$: Observable<Customer>;
  basket$: Observable<Basket>;
  basketLoading$: Observable<boolean>;

  constructor(private store: Store<CheckoutState>, private coreStore: Store<CoreState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.basketLoading$ = this.store.pipe(select(getBasketLoading));

    this.customer$ = this.coreStore.pipe(select(getLoggedInUser));
  }
}
