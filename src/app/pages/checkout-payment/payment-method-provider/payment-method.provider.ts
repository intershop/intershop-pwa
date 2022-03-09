import { Inject, Injectable } from '@angular/core';
import {
  PAYMENT_METHOD,
  PaymentMethodConfiguration,
} from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class PaymentMethodProvider {
  constructor(
    @Inject(PAYMENT_METHOD) private paymentMethodConfigurations: PaymentMethodConfiguration[],
    private checkoutFacade: CheckoutFacade
  ) {
    console.log(paymentMethodConfigurations);
  }

  getPaymentMethodConfig$(): Observable<FormlyFieldConfig[]> {
    return this.checkoutFacade.eligiblePaymentMethods$().pipe(
      whenTruthy(),
      map(paymentMethods =>
        paymentMethods.map<FormlyFieldConfig>(method => {
          const find = this.paymentMethodConfigurations.find(paymentMethod => paymentMethod.id === method.serviceId);
          return find
            ? find.getFormlyFieldConfig(method)
            : {
                template: `<div>${method.serviceId}</div>`,
              };
        })
      )
    );
  }
}
