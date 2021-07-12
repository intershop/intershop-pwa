import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-spa-checkout-payment-page',
  templateUrl: './spa-checkout-payment-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaCheckoutPaymentPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  loading$: Observable<boolean>;
  paymentMethods$: Observable<PaymentMethod[]>;
  priceType$: Observable<'gross' | 'net'>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.paymentMethods$ = this.checkoutFacade.eligiblePaymentMethods$();
    this.priceType$ = this.checkoutFacade.priceType$;
  }

  updateBasketPaymentMethod(paymentName: string) {
    this.checkoutFacade.setBasketPayment(paymentName);
  }

  createUserPaymentInstrument(instrument: PaymentInstrument) {
    this.checkoutFacade.createBasketPayment(instrument, true);
  }

  createPaymentInstrument(body: { paymentInstrument: PaymentInstrument; saveForLater: boolean }) {
    if (!body || !body.paymentInstrument) {
      return;
    }
    this.checkoutFacade.createBasketPayment(body.paymentInstrument, body.saveForLater);
  }

  deletePaymentInstrument(instrument: PaymentInstrument) {
    this.checkoutFacade.deleteBasketPayment(instrument);
  }

  /**
   * Validates the basket and jumps to the next checkout step (Review)
   */
  nextStep() {
    this.checkoutFacade.continue(4);
  }
}
