import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Basket } from '../../../models/basket/basket.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
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
  basket$: Observable<Basket>;
  loading$: Observable<boolean>;
  paymentMethods$: Observable<PaymentMethod[]>;
  basketError$: Observable<HttpError>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.loading$ = this.store.pipe(select(getBasketLoading));
    this.basketError$ = this.store.pipe(select(getBasketError));

    this.store.dispatch(new LoadBasketEligiblePaymentMethods());
    this.paymentMethods$ = this.store.pipe(select(getBasketEligiblePaymentMethods));
  }

  updateBasketPaymentMethod(paymentName: string) {
    this.store.dispatch(new SetBasketPayment(paymentName));
  }
}
