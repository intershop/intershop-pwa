import { Injectable } from '@angular/core';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';

@Injectable()
export class PaymentMethodFacade {
  private subscription: Subscription;

  paymentMethods$: Observable<PaymentMethod[]>; // all available payment methods for given basket
  openedParameterForm$ = new BehaviorSubject<string>(undefined); // opened payment method (id)

  deletePaymentInstrument: (pi: PaymentInstrument) => void; // callback function to delete payment method instrument

  submitPaymentInstrument: (paymentInstrument: PaymentInstrument, saveForLater: boolean) => void; // callback function to submit new payment instrument

  setPaymentMethodsSource(source: Observable<PaymentMethod[]>) {
    this.paymentMethods$ = source;
  }

  setSelectedPaymentMethodSource(source: Observable<string>) {
    if (this.subscription) {
      // eslint-disable-next-line ban/ban
      this.subscription.unsubscribe();
    }
    this.subscription = source.subscribe(() => this.closeParameterForm());
  }

  setDeletePaymentMethodInstrumentCallback(callback: (pi: PaymentInstrument) => void) {
    this.deletePaymentInstrument = callback;
  }

  setSubmitPaymentInstrumentCallback(callback: (pi: PaymentInstrument, saveForLater: boolean) => void) {
    this.submitPaymentInstrument = callback;
  }

  getPaymentMethodById$(id: string) {
    return this.paymentMethods$.pipe(map(paymentMethods => paymentMethods.find(pm => pm.serviceId === id)));
  }

  // set payment method id to open its form
  openParameterForm(id: string) {
    this.openedParameterForm$.next(id);
  }

  // close current parameter form
  closeParameterForm() {
    this.openedParameterForm$.next(undefined);
  }
}
