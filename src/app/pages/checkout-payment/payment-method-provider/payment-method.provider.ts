import { Inject, Injectable } from '@angular/core';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { PaymentMethodFacade } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-facade/payment-method.facade';
import {
  PAYMENT_METHOD,
  PaymentMethodConfiguration,
} from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, combineLatest, distinctUntilChanged, filter, map, shareReplay, switchMap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { whenTruthy } from 'ish-core/utils/operators';

const DEFAULT_ID = 'DEFAULT';

@Injectable()
export class PaymentMethodProvider {
  defaultPaymentMethodConfig: PaymentMethodConfiguration;
  specialPaymentMethodConfigs: PaymentMethodConfiguration[];

  private eligiblePaymentMethods$: Observable<PaymentMethod[]>;

  constructor(
    @Inject(PAYMENT_METHOD) paymentMethodConfigurations: PaymentMethodConfiguration[],
    private checkoutFacade: CheckoutFacade,
    private paymentMethodFacade: PaymentMethodFacade
  ) {
    // extract default and special payment method configurationss
    this.defaultPaymentMethodConfig = paymentMethodConfigurations.find(
      configuration => configuration.id === DEFAULT_ID
    );
    this.specialPaymentMethodConfigs = paymentMethodConfigurations.filter(
      configuration => configuration.id !== DEFAULT_ID
    );
    this.eligiblePaymentMethods$ = this.checkoutFacade.eligiblePaymentMethods$().pipe(shareReplay(1));

    // pass data to payment method facade
    this.paymentMethodFacade.setPaymentMethodsSource(this.eligiblePaymentMethods$);

    this.paymentMethodFacade.setSelectedPaymentMethodSource(
      this.checkoutFacade.basket$.pipe(
        filter(basket => !!basket?.payment?.paymentInstrument),
        map(basket => basket.payment.paymentInstrument.id),
        distinctUntilChanged()
      )
    );

    // pass callbacks to payment method facade
    this.paymentMethodFacade.setDeletePaymentMethodInstrumentCallback((pi: PaymentInstrument) =>
      this.checkoutFacade.deleteBasketPayment(pi)
    );

    this.paymentMethodFacade.setSubmitPaymentInstrumentCallback((pi: PaymentInstrument, saveForLater: boolean) =>
      this.checkoutFacade.createBasketPayment(pi, saveForLater)
    );
  }

  getPaymentMethodConfig$(): Observable<FormlyFieldConfig[]> {
    return this.eligiblePaymentMethods$.pipe(
      whenTruthy(),
      map(paymentMethods =>
        paymentMethods
          .map(pm => pm.serviceId)
          .filter(pm => !pm.toLowerCase().includes('concardis') && !pm.toLowerCase().includes('payone'))
      ),
      switchMap(paymentMethodIds =>
        combineLatest(
          paymentMethodIds.map(pmid => {
            const find = this.specialPaymentMethodConfigs.find(paymentMethodConfig => paymentMethodConfig.id === pmid);
            return find
              ? find.getFormlyFieldConfig$(pmid)
              : this.defaultPaymentMethodConfig.getFormlyFieldConfig$(pmid);
          })
        ).pipe(map(c => c.map(c2 => c2 ?? {})))
      )
    );
  }
}
