import { Injectable } from '@angular/core';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { Observable, map } from 'rxjs';

@Injectable()
export class PaymentMethodFacade {
  paymentMethods$: Observable<PaymentMethod[]>;

  deletePaymentInstrument: (pi: PaymentInstrument) => void;

  setPaymentMethodsSource(source: Observable<PaymentMethod[]>) {
    this.paymentMethods$ = source;
  }

  setDeletePaymentMethodInstrumentCallback(callback: (pi: PaymentInstrument) => void) {
    this.deletePaymentInstrument = callback;
  }

  getPaymentMethodById$(id: string) {
    return this.paymentMethods$.pipe(map(paymentMethods => paymentMethods.find(pm => pm.serviceId === id)));
  }
}
