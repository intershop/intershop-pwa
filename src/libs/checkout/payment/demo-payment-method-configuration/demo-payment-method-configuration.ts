import { Injectable } from '@angular/core';
import { PaymentMethodFacade } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-facade/payment-method.facade';
import { PaymentMethodConfiguration } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, filter, map } from 'rxjs';

@Injectable()
export class DemoPaymentMethodConfiguration implements PaymentMethodConfiguration {
  id = 'DEMO_PAYMENT';

  constructor(private paymentMethodFacade: PaymentMethodFacade) {}
  getFormlyFieldConfig$(paymentMethodId: string): Observable<FormlyFieldConfig> {
    return this.paymentMethodFacade.getPaymentMethodById$(paymentMethodId).pipe(
      filter(x => !!x),
      map(paymentMethod => ({
        type: 'ish-radio-field',
        wrappers: ['ish-payment-method-wrapper', 'form-field-checkbox-horizontal'],
        templateOptions: {
          paymentMethodId,
          label: paymentMethod.displayName,
        },
      }))
    );
  }
}
