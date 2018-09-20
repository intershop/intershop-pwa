import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import {
  LoadBasketEligiblePaymentMethods,
  SetBasketPayment,
  getBasketEligiblePaymentMethods,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from '../../store/basket';

@Component({
  selector: 'ish-checkout-payment-page-container',
  templateUrl: './checkout-payment-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentPageContainerComponent implements OnInit {
  basket$ = this.store.pipe(select(getCurrentBasket));
  loading$ = this.store.pipe(select(getBasketLoading));
  paymentMethods$ = this.store.pipe(select(getBasketEligiblePaymentMethods));
  basketError$ = this.store.pipe(select(getBasketError));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadBasketEligiblePaymentMethods());
  }

  updateBasketPaymentMethod(paymentName: string) {
    this.store.dispatch(new SetBasketPayment(paymentName));
  }
}
