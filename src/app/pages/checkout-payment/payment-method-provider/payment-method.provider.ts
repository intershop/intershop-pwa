import { Inject, Injectable } from '@angular/core';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import {
  PAYMENT_METHOD,
  PaymentMethodConfiguration,
} from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { whenTruthy } from 'ish-core/utils/operators';

const DEFAULT_ID = 'DEFAULT';

@Injectable()
export class PaymentMethodProvider {
  defaultPaymentMethod: PaymentMethodConfiguration;
  specialPaymentMethods: PaymentMethodConfiguration[];

  constructor(
    @Inject(PAYMENT_METHOD) paymentMethodConfigurations: PaymentMethodConfiguration[],
    private checkoutFacade: CheckoutFacade
  ) {
    this.defaultPaymentMethod = paymentMethodConfigurations.find(configuration => configuration.id === DEFAULT_ID);
    this.specialPaymentMethods = paymentMethodConfigurations.filter(configuration => configuration.id !== DEFAULT_ID);
  }

  getPaymentMethodConfig$(): Observable<FormlyFieldConfig[]> {
    return this.checkoutFacade.eligiblePaymentMethods$().pipe(
      whenTruthy(),
      map(paymentMethods =>
        paymentMethods.map<FormlyFieldConfig>(method => {
          const find = this.specialPaymentMethods.find(paymentMethod => paymentMethod.id === method.serviceId);
          return find
            ? find.getFormlyFieldConfig(method)
            : this.defaultPaymentMethod.getFormlyFieldConfig(method, (p: PaymentInstrument) =>
                this.checkoutFacade.deleteBasketPayment(p)
              );
        })
      )
    );
  }
}
