import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import {
  ContinueCheckout,
  CreateBasketPayment,
  DeleteBasketPayment,
  LoadBasketEligiblePaymentMethods,
  SetBasketPayment,
  getBasketEligiblePaymentMethods,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from 'ish-core/store/checkout/basket';

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
    this.basket$
      .pipe(
        filter(x => !!x),
        take(1)
      )
      .subscribe(() => this.store.dispatch(new LoadBasketEligiblePaymentMethods()));
  }

  updateBasketPaymentMethod(paymentName: string) {
    this.store.dispatch(new SetBasketPayment({ id: paymentName }));
  }

  createBasketPaymentInstrument(paymentInstrument: PaymentInstrument) {
    this.store.dispatch(new CreateBasketPayment({ paymentInstrument }));
  }

  deletePaymentInstrument(paymentInstrumentId: string) {
    this.store.dispatch(new DeleteBasketPayment({ id: paymentInstrumentId }));
  }

  /**
   * Validates the basket and jumps to the next checkout step (Review)
   */
  nextStep() {
    this.store.dispatch(new ContinueCheckout({ targetStep: 4 }));
  }
}
